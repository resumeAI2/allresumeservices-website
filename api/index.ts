import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthRoutes } from "../server/_core/authRoutes";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { parse } from "url";
import { apiLimiter, authLimiter } from "../server/middleware/rateLimit";

// Import Express app setup
let app: any = null;

async function getApp() {
  if (app) return app;

  const express = (await import("express")).default;
  app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Apply rate limiting to auth routes (authentication)
  app.use('/api/auth', authLimiter);

  // NextAuth.js authentication routes under /api/auth/*
  registerAuthRoutes(app);

  // SEO routes - sitemap and robots.txt
  app.get("/sitemap.xml", async (req: any, res: any) => {
    try {
      const sitemapRoute = await import("../server/routes/sitemap.xml.js");
      await sitemapRoute.GET(req, res);
    } catch (error) {
      console.error("[Sitemap] Error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", async (req: any, res: any) => {
    try {
      const robotsRoute = await import("../server/routes/robots.txt.js");
      await robotsRoute.GET(req, res);
    } catch (error) {
      console.error("[Robots] Error:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // Cron job endpoints (protected with CRON_SECRET)
  app.get("/api/cron/backup", async (req: any, res: any) => {
    try {
      // Verify cron secret for security
      const cronSecret = process.env.CRON_SECRET;
      const providedSecret = req.headers.authorization?.replace("Bearer ", "") || req.query.secret;
      
      if (cronSecret && providedSecret !== cronSecret) {
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
      // Verify cron secret for security
      const cronSecret = process.env.CRON_SECRET;
      const providedSecret = req.headers.authorization?.replace("Bearer ", "") || req.query.secret;
      
      if (cronSecret && providedSecret !== cronSecret) {
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

// Helper to convert Vercel request to Express-compatible format
function createExpressRequest(req: VercelRequest): any {
  const parsedUrl = parse(req.url || "/", true);
  
  return {
    method: req.method,
    url: req.url,
    path: parsedUrl.pathname || "/",
    query: parsedUrl.query,
    headers: req.headers,
    body: req.body,
    protocol: (req.headers["x-forwarded-proto"] as string) || "https",
    get: (name: string) => req.headers[name.toLowerCase()] as string | undefined,
    originalUrl: req.url || "/",
    socket: {
      remoteAddress: req.headers["x-forwarded-for"] as string || req.headers["x-real-ip"] as string,
    },
    ip: req.headers["x-forwarded-for"] as string || req.headers["x-real-ip"] as string,
  };
}

// Helper to create Express-compatible response
function createExpressResponse(res: VercelResponse): any {
  const expressRes: any = {
    statusCode: 200,
    status: function(code: number) {
      this.statusCode = code;
      res.status(code);
      return this;
    },
    send: function(body: any) {
      res.status(this.statusCode).send(body);
      return this;
    },
    json: function(body: any) {
      res.status(this.statusCode).json(body);
      return this;
    },
    redirect: function(status: number, url: string) {
      res.redirect(status, url);
      return this;
    },
    cookie: function(name: string, value: string, options: any = {}) {
      const cookieOptions: string[] = [];
      if (options.maxAge) cookieOptions.push(`Max-Age=${options.maxAge}`);
      if (options.path) cookieOptions.push(`Path=${options.path}`);
      if (options.domain) cookieOptions.push(`Domain=${options.domain}`);
      if (options.secure) cookieOptions.push("Secure");
      if (options.httpOnly) cookieOptions.push("HttpOnly");
      if (options.sameSite) cookieOptions.push(`SameSite=${options.sameSite}`);
      
      const cookieString = `${name}=${value}${cookieOptions.length ? "; " + cookieOptions.join("; ") : ""}`;
      res.setHeader("Set-Cookie", cookieString);
      return this;
    },
    clearCookie: function(name: string, options: any = {}) {
      const cookieOptions: string[] = ["Max-Age=0"];
      if (options.path) cookieOptions.push(`Path=${options.path}`);
      if (options.domain) cookieOptions.push(`Domain=${options.domain}`);
      
      const cookieString = `${name}=; ${cookieOptions.join("; ")}`;
      res.setHeader("Set-Cookie", cookieString);
      return this;
    },
    setHeader: function(name: string, value: string) {
      res.setHeader(name, value);
      return this;
    },
    sendFile: function(filePath: string) {
      // Static files should be served by Vercel, not Express
      res.status(404).send("File not found");
      return this;
    },
  };
  
  return expressRes;
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const expressApp = await getApp();
    const expressReq = createExpressRequest(req);
    const expressRes = createExpressResponse(res);

    // Handle the request with Express app
    return new Promise<void>((resolve, reject) => {
      expressApp(expressReq, expressRes, (err: any) => {
        if (err) {
          console.error("[API] Error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("[API] Handler Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
    throw error;
  }
}
