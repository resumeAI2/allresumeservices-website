import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GET, POST } from "../../server/_core/auth";

/**
 * NextAuth.js API Route Handler for Vercel Serverless Functions
 * 
 * This handles all NextAuth.js authentication routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/:provider
 * - /api/auth/session
 * - /api/auth/csrf
 * - etc.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert Vercel request to standard Request object
  const url = new URL(
    req.url || "/api/auth",
    `https://${req.headers.host || "localhost"}`
  );

  const request = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });

  // Route to appropriate handler
  let response: Response;
  if (req.method === "GET") {
    response = await GET(request);
  } else if (req.method === "POST") {
    response = await POST(request);
  } else {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Convert Response to Vercel response
  const body = await response.text();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  res.status(response.status);
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.send(body);
}
