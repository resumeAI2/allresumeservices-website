import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Dynamic imports to diagnose ERR_MODULE_NOT_FOUND
let createExpressMiddleware: any;
let registerAuthRoutes: any;
let appRouter: any;
let createContext: any;
let apiLimiter: any;
let authLimiter: any;

import { parse } from "url";
import crypto from "node:crypto";

let _initPromise: Promise<void> | null = null;

async function initModules() {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    try {
      const trpcMod = await import("@trpc/server/adapters/express");
      createExpressMiddleware = trpcMod.createExpressMiddleware;
    } catch (e: any) { console.error("[INIT] Failed to import @trpc/server/adapters/express:", e.message, e.code); throw e; }

    try {
      const authRoutesMod = await import("../server/_core/authRoutes");
      registerAuthRoutes = authRoutesMod.registerAuthRoutes;
    } catch (e: any) { console.error("[INIT] Failed to import authRoutes:", e.message, e.code); throw e; }

    try {
      const routersMod = await import("../server/routers");
      appRouter = routersMod.appRouter;
    } catch (e: any) { console.error("[INIT] Failed to import routers:", e.message, e.code); throw e; }

    try {
      const contextMod = await import("../server/_core/context");
      createContext = contextMod.createContext;
    } catch (e: any) { console.error("[INIT] Failed to import context:", e.message, e.code); throw e; }

    try {
      const rateLimitMod = await import("../server/middleware/rateLimit");
      apiLimiter = rateLimitMod.apiLimiter;
      authLimiter = rateLimitMod.authLimiter;
    } catch (e: any) { console.error("[INIT] Failed to import rateLimit:", e.message, e.code); throw e; }
  })();
  return _initPromise;
}

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Import Express app setup
let app: any = null;

async function getApp() {
  if (app) return app;

  // Initialize all dynamic imports first (for diagnosing ERR_MODULE_NOT_FOUND)
  await initModules();

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
      const sitemapRoute = await import("../server/routes/sitemap.xml");
      await sitemapRoute.GET(req, res);
    } catch (error) {
      console.error("[Sitemap] Error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", async (req: any, res: any) => {
    try {
      const robotsRoute = await import("../server/routes/robots.txt");
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
