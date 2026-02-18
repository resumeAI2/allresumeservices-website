import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createHttpServer } from "http";
import https from "https";
import net from "net";
// @ts-expect-error no types; used only when DEV_HTTPS=1 in development
import selfsigned from "selfsigned";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthRoutes } from "./authRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initDatabaseBackupCron } from "../cron/databaseBackupCron";
import { apiLimiter, authLimiter } from "../middleware/rateLimit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();

  const useHttps =
    process.env.NODE_ENV === "development" &&
    (process.env.DEV_HTTPS === "1" || process.env.DEV_HTTPS === "true");

  let server: ReturnType<typeof createHttpServer>;
  if (useHttps) {
    const pems = selfsigned.generate(
      [{ name: "commonName", value: "localhost" }],
      { days: 365, keySize: 2048, notBeforeDate: new Date(), algorithm: "sha256" }
    );
    server = https.createServer(
      { key: pems.private, cert: pems.cert },
      app
    ) as unknown as ReturnType<typeof createHttpServer>;
  } else {
    server = createHttpServer(app);
  }

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Apply rate limiting to auth routes (authentication)
  app.use("/api/auth", authLimiter);

  // NextAuth.js authentication routes under /api/auth/*
  registerAuthRoutes(app);

  // SEO routes - sitemap and robots.txt
  const sitemapRoute = await import("../routes/sitemap.xml.js");
  const robotsRoute = await import("../routes/robots.txt.js");
  app.get("/sitemap.xml", sitemapRoute.GET);
  app.get("/robots.txt", robotsRoute.GET);

  // Permanent redirect so /pricing is not reported as "Page with redirect" in GSC (canonical is /packages)
  app.get("/pricing", (_req, res) => res.redirect(301, "/packages"));

  // Apply general API rate limiting to all tRPC routes
  app.use("/api/trpc", apiLimiter);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  const protocol = useHttps ? "https" : "http";
  const url = `${protocol}://localhost:${port}/`;
  server.listen(port, () => {
    console.log(`Server running on ${url}`);
    if (useHttps) {
      console.log("(HTTPS for Cursor preview – accept the self-signed cert if prompted)");
    }
    // Write copy-paste file so user can open it and copy the URL
    const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
    const copyFile = path.join(projectRoot, "PREVIEW_URL.txt");
    const copyContent = [
      "Copy the line below (only the URL) and paste it into Simple Browser.",
      "",
      "Steps:",
      "  1. Press Ctrl+Shift+P",
      "  2. Type: Simple Browser: Show",
      "  3. Paste the URL from below into the box and press Enter",
      "",
      "-------- COPY FROM BELOW THIS LINE --------",
      url.trim(),
      "-------- COPY FROM ABOVE THIS LINE --------",
    ].join("\n");
    try {
      fs.writeFileSync(copyFile, copyContent, "utf8");
      console.log("");
      console.log("  Open the file PREVIEW_URL.txt in this project to copy the URL.");
      console.log("  (It's in the project root — use the file explorer on the left.)");
      console.log("");
    } catch {
      // ignore if we can't write (e.g. read-only)
    }
    // Initialize scheduled tasks
    initDatabaseBackupCron();
  });
}

startServer().catch(console.error);
