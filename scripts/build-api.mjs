/**
 * Build script that produces Vercel Build Output API v3 format.
 *
 * Instead of relying on Vercel's auto-detection (which uses ncc and has
 * module resolution issues), we produce the full .vercel/output/ structure:
 *
 *   .vercel/output/
 *     config.json              -- routing, headers, crons
 *     static/                  -- frontend files (from dist/public)
 *     functions/
 *       api/
 *         index.func/          -- main API serverless function
 *           index.js
 *           .vc-config.json
 *         auth/
 *           [...nextauth].func/  -- auth serverless function
 *             index.js
 *             .vc-config.json
 */
import { build } from "esbuild";
import {
  mkdirSync,
  rmSync,
  cpSync,
  writeFileSync,
  existsSync,
} from "fs";
import { join } from "path";

const OUTPUT = ".vercel/output";

// ── 1. Clean previous output ──────────────────────────────────────────────────
console.log("Cleaning previous build output...");
try {
  rmSync(OUTPUT, { recursive: true, force: true });
} catch {}

// ── 2. Create directory structure ─────────────────────────────────────────────
const dirs = [
  join(OUTPUT, "static"),
  join(OUTPUT, "functions/api/index.func"),
  join(OUTPUT, "functions/api/auth/[...nextauth].func"),
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

// ── 4. Bundle main API function ───────────────────────────────────────────────
console.log("Bundling api/index serverless function...");
await build({
  entryPoints: ["server/api/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: join(OUTPUT, "functions/api/index.func/index.js"),
  packages: "external",
  external: ["dotenv", "dotenv/config"],
  tsconfig: "tsconfig.json",
});

writeFileSync(
  join(OUTPUT, "functions/api/index.func/.vc-config.json"),
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

// ── 5. Bundle auth function ───────────────────────────────────────────────────
console.log("Bundling api/auth/[...nextauth] serverless function...");
await build({
  entryPoints: ["api/auth/[...nextauth].ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: join(
    OUTPUT,
    "functions/api/auth/[...nextauth].func/index.js"
  ),
  packages: "external",
  external: ["dotenv", "dotenv/config"],
  tsconfig: "tsconfig.json",
});

writeFileSync(
  join(
    OUTPUT,
    "functions/api/auth/[...nextauth].func/.vc-config.json"
  ),
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

// ── 6. Generate config.json (routing, headers, crons) ─────────────────────────
console.log("Generating config.json...");

const config = {
  version: 3,
  routes: [
    // CORS preflight
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
    // API CORS headers
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
    // Security headers for all paths
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
    // Static asset cache headers
    {
      src: "/assets/(.*)",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      continue: true,
    },
    // Auth routes -> auth function
    {
      src: "/api/auth/(.*)",
      dest: "/api/auth/[...nextauth]",
    },
    // tRPC routes -> main API function
    {
      src: "/api/trpc/(.*)",
      dest: "/api/index",
    },
    // Cron routes -> main API function
    {
      src: "/api/cron/(.*)",
      dest: "/api/index",
    },
    // PayPal routes -> main API function
    {
      src: "/api/paypal/(.*)",
      dest: "/api/index",
    },
    // Sitemap and robots
    { src: "/sitemap.xml", dest: "/api/index" },
    { src: "/robots.txt", dest: "/api/index" },
    // SPA fallback: all non-API routes to index.html
    {
      handle: "filesystem",
    },
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
console.log(
  "  Functions: api/index, api/auth/[...nextauth]"
);
console.log("  Static: copied from dist/public");
