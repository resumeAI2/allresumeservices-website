import type { Express, Request, Response } from "express";
import { GET, POST } from "./auth";

/**
 * Register NextAuth.js routes for Express (local development)
 * 
 * This handles all NextAuth.js authentication routes in the Express server:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/:provider
 * - /api/auth/session
 * - /api/auth/csrf
 * - etc.
 */

export function registerAuthRoutes(app: Express) {
  // Handle all /api/auth/* routes
  app.all("/api/auth/*", async (req: Request, res: Response) => {
    try {
      // Convert Express request to standard Request object
      const url = new URL(
        req.url,
        `${req.protocol}://${req.get("host")}`
      );

      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const request = new Request(url, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" 
          ? JSON.stringify(req.body) 
          : undefined,
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

      // Convert Response to Express response
      const body = await response.text();
      
      // Set status code
      res.status(response.status);
      
      // Copy headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send response
      res.send(body);
    } catch (error) {
      console.error("[Auth] Route handler error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
