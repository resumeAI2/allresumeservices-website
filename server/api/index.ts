import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "../_core/context";
import { registerAuthRoutes } from "../_core/authRoutes";
import { apiLimiter, authLimiter } from "../middleware/rateLimit";
import { parse } from "url";
import crypto from "node:crypto";

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Import Express app setup
let app: any = null;

async function getApp() {
  if (app) return app;

  const express = (await import("express")).default;
  app = express();

  // Configure body parser with sensible default limits
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));

  // Apply rate limiting to auth routes (authentication)
  app.use('/api/auth', authLimiter);

  // NextAuth.js authentication routes under /api/auth/*
  registerAuthRoutes(app);

  // SEO routes - sitemap and robots.txt
  app.get("/sitemap.xml", async (req: any, res: any) => {
    try {
      const sitemapRoute = await import("../routes/sitemap.xml");
      await sitemapRoute.GET(req, res);
    } catch (error) {
      console.error("[Sitemap] Error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", async (req: any, res: any) => {
    try {
      const robotsRoute = await import("../routes/robots.txt");
      await robotsRoute.GET(req, res);
    } catch (error) {
      console.error("[Robots] Error:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // Cron job endpoints (protected with CRON_SECRET - fail closed)
  app.get("/api/cron/backup", async (req: any, res: any) => {
    try {
      // Verify cron secret for security (fail-closed: reject if not configured)
      const cronSecret = process.env.CRON_SECRET;
      if (!cronSecret) {
        console.error("[Cron Backup] CRON_SECRET not configured - rejecting request");
        return res.status(403).json({ error: "Cron secret not configured" });
      }
      const providedSecret = req.headers.authorization?.replace("Bearer ", "") || "";

      if (!safeCompare(providedSecret, cronSecret)) {
        console.error("[Cron Backup] Unauthorized access attempt");
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("[Cron Backup] Starting database backup...");
      const { triggerManualBackup } = await import("../server/cron/databaseBackupCron");
      const result = await triggerManualBackup();
      
      if (result.success) {
        console.log(`[Cron Backup] Backup completed successfully at ${result.timestamp}`);
        res.json({
          success: true,
          message: "Backup completed successfully",
          timestamp: result.timestamp,
          tables: result.tables.length,
        });
      } else {
        console.error("[Cron Backup] Backup failed:", result.error);
        res.status(500).json({
          success: false,
          error: result.error,
          timestamp: result.timestamp,
        });
      }
    } catch (error) {
      console.error("[Cron Backup] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/cron/review-requests", async (req: any, res: any) => {
    try {
      // Verify cron secret for security (fail-closed: reject if not configured)
      const cronSecret = process.env.CRON_SECRET;
      if (!cronSecret) {
        console.error("[Cron Review Requests] CRON_SECRET not configured - rejecting request");
        return res.status(403).json({ error: "Cron secret not configured" });
      }
      const providedSecret = req.headers.authorization?.replace("Bearer ", "") || "";

      if (!safeCompare(providedSecret, cronSecret)) {
        console.error("[Cron Review Requests] Unauthorized access attempt");
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("[Cron Review Requests] Starting review request processing...");
      const { runReviewRequestCron } = await import("../server/cron/reviewRequestCron");
      const result = await runReviewRequestCron();
      
      console.log(`[Cron Review Requests] Completed. Processed ${result?.processed || 0} records.`);
      res.json({
        success: true,
        message: "Review requests processed",
        processed: result?.processed || 0,
        sent: result?.sent || 0,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Cron Review Requests] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PayPal Webhook endpoint
  app.post("/api/paypal/webhook", async (req: any, res: any) => {
    try {
      console.log("[PayPal Webhook] Received webhook event");
      
      const { verifyWebhookSignature, processWebhookEvent } = await import("../server/paypal");
      
      // Get PayPal signature headers
      const headers = {
        'paypal-transmission-id': req.headers['paypal-transmission-id'] as string,
        'paypal-transmission-time': req.headers['paypal-transmission-time'] as string,
        'paypal-transmission-sig': req.headers['paypal-transmission-sig'] as string,
        'paypal-cert-url': req.headers['paypal-cert-url'] as string,
        'paypal-auth-algo': req.headers['paypal-auth-algo'] as string,
      };
      
      // Verify all required headers are present
      if (!headers['paypal-transmission-id'] || !headers['paypal-transmission-sig']) {
        console.error("[PayPal Webhook] Missing required headers");
        return res.status(400).json({ error: "Missing required PayPal headers" });
      }
      
      // Get raw body for signature verification
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      
      // Verify webhook signature
      const isValid = await verifyWebhookSignature(headers, rawBody);
      
      if (!isValid) {
        console.error("[PayPal Webhook] Invalid signature");
        return res.status(401).json({ error: "Invalid webhook signature" });
      }
      
      // Parse and process the event
      const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await processWebhookEvent(event);
      
      console.log(`[PayPal Webhook] Event processed: ${result.message}`);
      
      // Always return 200 to acknowledge receipt (even if processing fails)
      // PayPal will retry on non-2xx responses
      res.status(200).json({ 
        received: true, 
        success: result.success,
        message: result.message 
      });
    } catch (error) {
      console.error("[PayPal Webhook] Error:", error);
      // Return 200 to prevent PayPal from retrying indefinitely
      res.status(200).json({ 
        received: true, 
        success: false, 
        error: "Internal processing error" 
      });
    }
  });

  // Apply general API rate limiting to all tRPC routes
  app.use('/api/trpc', apiLimiter);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

/**
 * Reconstruct the original URL from Vercel's rewritten request.
 * 
 * Vercel rewrites /api/trpc/services.getAllServices?input=...
 * to /api/handler?__original_path=/api/trpc/services.getAllServices&input=...
 * 
 * We need to restore the original URL for Express routing to work.
 */
function getOriginalUrl(req: VercelRequest): string {
  const rawUrl = req.url || "/";
  const parsedUrl = parse(rawUrl, true);
  const originalPath = parsedUrl.query.__original_path as string | undefined;
  
  if (!originalPath) {
    return rawUrl;
  }
  
  // Remove __original_path from query params and reconstruct
  const otherParams = { ...parsedUrl.query };
  delete otherParams.__original_path;
  const queryParts = Object.entries(otherParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  
  return queryParts ? `${originalPath}?${queryParts}` : originalPath;
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const expressApp = await getApp();
    
    // Restore the original URL (before Vercel's rewrite)
    const originalUrl = getOriginalUrl(req);
    console.log(`[API] ${req.method} ${originalUrl} (raw: ${req.url})`);
    
    // Patch req.url so Express routing matches the original path.
    // VercelRequest extends Node's IncomingMessage, so this is safe.
    (req as any).url = originalUrl;
    (req as any).originalUrl = originalUrl;

    // Pass the real Node.js req/res to Express.
    // VercelRequest/VercelResponse ARE Node IncomingMessage/ServerResponse
    // with added helpers, so Express can handle them natively.
    return new Promise<void>((resolve, reject) => {
      expressApp(req, res, (err: any) => {
        if (err) {
          console.error("[API] Express error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
          }
          resolve();
        } else {
          // No route matched - send 404
          if (!res.headersSent) {
            res.status(404).json({ error: "Not found" });
          }
          resolve();
        }
      });
    });
  } catch (error: any) {
    console.error("[API] Handler Error:", error?.message ?? error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
