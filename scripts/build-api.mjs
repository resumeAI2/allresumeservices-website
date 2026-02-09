/**
 * Build script for Vercel Build Output API v3.
 *
 * Produces the .vercel/output/ directory structure that Vercel deploys directly,
 * bypassing Vercel's automatic detection and ncc bundling (which has module
 * resolution issues with this project's ESM/CJS mix).
 *
 * Architecture:
 *   .vercel/output/
 *     config.json                        -- routing, headers, crons
 *     static/                            -- frontend files (from dist/public)
 *     functions/
 *       api/
 *         handler.func/                  -- single API serverless function
 *           index.js                     -- esbuild-bundled CJS output
 *           .vc-config.json              -- runtime configuration
 *
 * How routing works:
 *   Vercel's `handle: "filesystem"` does NOT resolve dynamic catch-all
 *   function patterns (e.g. `[[...path]].func`). Therefore we use an
 *   explicit rewrite rule to route all /api/* requests to /api/handler.
 *
 *   The original path is passed via the `__path` query parameter:
 *     /api/trpc/services.getAllServices?batch=1&input=...
 *     → /api/handler?__path=trpc/services.getAllServices&batch=1&input=...
 *
 *   Vercel preserves the original query parameters when rewriting, so
 *   `batch=1&input=...` are automatically appended to the dest URL.
 *
 *   Inside the handler, req.url is reconstructed as:
 *     /api/trpc/services.getAllServices?batch=1&input=...
 *   by reading __path, prepending /api/, stripping __path from the query,
 *   and keeping all other query parameters intact.
 */
import { build } from "esbuild";
import {
  mkdirSync,
  rmSync,
  cpSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

const OUTPUT = ".vercel/output";

// ── 1. Clean previous output ──────────────────────────────────────────────────
console.log("Cleaning previous build output...");
try {
  rmSync(OUTPUT, { recursive: true, force: true });
} catch {}

// ── 2. Create directory structure ─────────────────────────────────────────────
const dirs = [
  join(OUTPUT, "static"),
  join(OUTPUT, "functions/api/handler.func"),
];
for (const dir of dirs) {
  mkdirSync(dir, { recursive: true });
}

// ── 3. Copy static files from dist/public ─────────────────────────────────────
console.log("Copying static files...");
if (existsSync("dist/public")) {
  cpSync("dist/public", join(OUTPUT, "static"), { recursive: true });
} else {
  console.error("ERROR: dist/public does not exist. Run vite build first.");
  process.exit(1);
}

// ── 4. Bundle the API function ────────────────────────────────────────────────
console.log("Bundling api/handler serverless function...");
await build({
  entryPoints: ["server/api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: join(OUTPUT, "functions/api/handler.func/index.js"),
  // Bundle ALL dependencies since .func directories don't have node_modules.
  // Only exclude packages with native binaries that can't be bundled.
  external: ["sharp"],
  tsconfig: "tsconfig.json",
});

writeFileSync(
  join(OUTPUT, "functions/api/handler.func/.vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
      shouldAddHelpers: true,
      maxDuration: 30,
    },
    null,
    2
  )
);

// ── 5. Generate config.json ───────────────────────────────────────────────────
console.log("Generating config.json...");

const config = {
  version: 3,
  routes: [
    // ────────────────────────────────────────────────────────────────────────
    // Phase 1: Headers (continue: true = add headers and keep processing)
    // ────────────────────────────────────────────────────────────────────────

    // CORS preflight — terminates immediately with 204
    {
      src: "/api/(.*)",
      methods: ["OPTIONS"],
      headers: {
        "Access-Control-Allow-Origin": "https://www.allresumeservices.com.au",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
      status: 204,
      continue: false,
    },
    // CORS response headers for API routes
    {
      src: "/api/(.*)",
      headers: {
        "Access-Control-Allow-Origin": "https://www.allresumeservices.com.au",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
      continue: true,
    },
    // Security headers for all routes
    {
      src: "/(.*)",
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://www.paypal.com https://www.google.com https://www.gstatic.com https://fonts.gstatic.com; connect-src 'self' https://www.paypal.com https://api-m.paypal.com; frame-src https://www.paypal.com https://www.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
      },
      continue: true,
    },
    // Long-lived cache for hashed static assets
    {
      src: "/assets/(.*)",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      continue: true,
    },

    // ────────────────────────────────────────────────────────────────────────
    // Phase 2: Static file resolution
    // ────────────────────────────────────────────────────────────────────────
    // Check static files FIRST so that real files in /static are served
    // directly (e.g. /favicon.ico, /assets/*, etc.)
    {
      handle: "filesystem",
    },

    // ────────────────────────────────────────────────────────────────────────
    // Phase 3: API rewrites (after filesystem, so static files take priority)
    // ────────────────────────────────────────────────────────────────────────

    // SEO routes → API handler
    // Vercel merges original query params with dest query params
    { src: "/sitemap.xml", dest: "/api/handler?__path=sitemap.xml" },
    { src: "/robots.txt", dest: "/api/handler?__path=robots.txt" },

    // All /api/* routes → API handler, with path captured in __path
    // Example: /api/trpc/services.getAllServices?batch=1&input=...
    //        → /api/handler?__path=trpc/services.getAllServices&batch=1&input=...
    {
      src: "/api/(.*)",
      dest: "/api/handler?__path=$1",
    },

    // ────────────────────────────────────────────────────────────────────────
    // Phase 4: SPA fallback for non-API routes
    // ────────────────────────────────────────────────────────────────────────
    {
      src: "/((?!api).*)",
      dest: "/index.html",
    },
  ],
  crons: [
    {
      path: "/api/cron/backup",
      schedule: "0 2 * * *",
    },
    {
      path: "/api/cron/review-requests",
      schedule: "0 9 * * *",
    },
  ],
};

writeFileSync(join(OUTPUT, "config.json"), JSON.stringify(config, null, 2));

console.log("✓ Build Output API structure created successfully");
console.log("  Function: api/handler (single serverless function)");
console.log("  Static: copied from dist/public");
