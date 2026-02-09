// dotenv/config is a no-op on Vercel (env vars injected natively)
// but needed for local development with `node dist/index.js`
import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "../_core/context";
import { registerAuthRoutes } from "../_core/authRoutes";
import { apiLimiter, authLimiter } from "../middleware/rateLimit";
import crypto from "node:crypto";

// ── Utility ───────────────────────────────────────────────────────────────────

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Reconstruct the original URL from Vercel's rewritten request.
 *
 * Vercel rewrites:
 *   /api/trpc/services.getAllServices?batch=1&input=...
 *   → /api/handler?__path=trpc/services.getAllServices&batch=1&input=...
 *
 * This function reconstructs:
 *   /api/trpc/services.getAllServices?batch=1&input=...
 *
 * For SEO routes, Vercel rewrites:
 *   /sitemap.xml → /api/handler?__path=sitemap.xml
 *   → reconstructed as /sitemap.xml
 *
 * If __path is not present (e.g. direct invocation), returns req.url as-is.
 */
function reconstructUrl(rawUrl: string): string {
  // Use URL API with a dummy base to parse safely
  const parsed = new URL(rawUrl, "http://localhost");
  const pathParam = parsed.searchParams.get("__path");

  if (pathParam === null) {
    // No rewrite — return the URL as-is (e.g. direct cron invocation)
    return rawUrl;
  }

  // Determine the original path prefix.
  // SEO routes (sitemap.xml, robots.txt) don't have /api/ prefix.
  // API routes have /api/ prefix.
  const seoRoutes = ["sitemap.xml", "robots.txt"];
  const originalPath = seoRoutes.includes(pathParam)
    ? `/${pathParam}`
    : `/api/${pathParam}`;

  // Remove __path from query params and rebuild query string
  parsed.searchParams.delete("__path");
  const remainingQuery = parsed.searchParams.toString();

  return remainingQuery ? `${originalPath}?${remainingQuery}` : originalPath;
}

// ── Express App Singleton ─────────────────────────────────────────────────────

let app: ReturnType<typeof import("express").default> | null = null;
let appInitError: Error | null = null;

async function getApp() {
  // If initialization previously failed, clear cache and retry.
  // Serverless functions may get fresh env vars on cold start.
  if (appInitError) {
    console.warn("[API] Retrying Express initialization after previous failure...");
    appInitError = null;
    app = null;
  }
  if (app) return app;

  try {
    const express = (await import("express")).default;
    const expressApp = express();

    // ── Body parsing ────────────────────────────────────────────────
    expressApp.use(express.json({ limit: "5mb" }));
    expressApp.use(express.urlencoded({ limit: "5mb", extended: true }));

    // ── Auth routes (must come before general rate limiter) ─────────
    expressApp.use("/api/auth", authLimiter);
    registerAuthRoutes(expressApp);

    // ── SEO routes ──────────────────────────────────────────────────
    // Registered at the path the URL is reconstructed to
    const sitemapHandler = async (req: any, res: any) => {
      try {
        const sitemapRoute = await import("../routes/sitemap.xml");
        await sitemapRoute.GET(req, res);
      } catch (error) {
        console.error("[Sitemap] Error:", error);
        res.status(500).send("Error generating sitemap");
      }
    };
    expressApp.get("/sitemap.xml", sitemapHandler);

    const robotsHandler = async (req: any, res: any) => {
      try {
        const robotsRoute = await import("../routes/robots.txt");
        await robotsRoute.GET(req, res);
      } catch (error) {
        console.error("[Robots] Error:", error);
        res.status(500).send("Error generating robots.txt");
      }
    };
    expressApp.get("/robots.txt", robotsHandler);

    // ── Cron endpoints (protected by CRON_SECRET) ───────────────────
    expressApp.get("/api/cron/backup", async (req: any, res: any) => {
      try {
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

    expressApp.get("/api/cron/review-requests", async (req: any, res: any) => {
      try {
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

    // ── PayPal webhook ──────────────────────────────────────────────
    expressApp.post("/api/paypal/webhook", async (req: any, res: any) => {
      try {
        console.log("[PayPal Webhook] Received webhook event");
        const { verifyWebhookSignature, processWebhookEvent } = await import("../server/paypal");

        const headers = {
          "paypal-transmission-id": req.headers["paypal-transmission-id"] as string,
          "paypal-transmission-time": req.headers["paypal-transmission-time"] as string,
          "paypal-transmission-sig": req.headers["paypal-transmission-sig"] as string,
          "paypal-cert-url": req.headers["paypal-cert-url"] as string,
          "paypal-auth-algo": req.headers["paypal-auth-algo"] as string,
        };

        if (!headers["paypal-transmission-id"] || !headers["paypal-transmission-sig"]) {
          console.error("[PayPal Webhook] Missing required headers");
          return res.status(400).json({ error: "Missing required PayPal headers" });
        }

        const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        const isValid = await verifyWebhookSignature(headers, rawBody);

        if (!isValid) {
          console.error("[PayPal Webhook] Invalid signature");
          return res.status(401).json({ error: "Invalid webhook signature" });
        }

        const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const result = await processWebhookEvent(event);

        console.log(`[PayPal Webhook] Event processed: ${result.message}`);
        res.status(200).json({
          received: true,
          success: result.success,
          message: result.message,
        });
      } catch (error) {
        console.error("[PayPal Webhook] Error:", error);
        // Return 200 to prevent PayPal from retrying indefinitely
        res.status(200).json({
          received: true,
          success: false,
          error: "Internal processing error",
        });
      }
    });

    // ── tRPC API ────────────────────────────────────────────────────
    expressApp.use("/api/trpc", apiLimiter);
    expressApp.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );

    app = expressApp;
    return app;
  } catch (error) {
    appInitError = error instanceof Error ? error : new Error(String(error));
    console.error("[API] Express app initialization failed:", appInitError.message);
    throw appInitError;
  }
}

// ── Vercel Serverless Function Handler ────────────────────────────────────────
//
// Deployed at: functions/api/handler.func
// Accessible at: /api/handler
//
// All /api/* requests are rewritten to /api/handler?__path=<sub-path>
// by the Vercel routing config (see scripts/build-api.mjs).
//
// This handler:
// 1. Reconstructs the original URL from the __path query param
// 2. Patches req.url and req.originalUrl for Express routing
// 3. Passes the VercelRequest/VercelResponse to Express natively
//    (they extend Node's IncomingMessage/ServerResponse)
//
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const expressApp = await getApp();

    // Reconstruct the original URL before Vercel's rewrite
    const originalUrl = reconstructUrl(req.url || "/");
    console.log(`[API] ${req.method} ${originalUrl}`);

    // Patch req.url so Express routing matches the original path.
    // VercelRequest extends Node's IncomingMessage so this is safe.
    (req as any).url = originalUrl;
    (req as any).originalUrl = originalUrl;

    // Pass the real Node.js req/res directly to Express.
    // VercelRequest/VercelResponse extend IncomingMessage/ServerResponse
    // with added helpers, so Express handles them natively.
    return new Promise<void>((resolve) => {
      expressApp(req, res, (err: any) => {
        if (err) {
          console.error("[API] Express error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
          }
          resolve();
        } else {
          // No route matched
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
