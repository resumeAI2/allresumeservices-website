import { GET, POST } from "./auth";

// Use generic types to avoid Express/Vercel type conflicts
interface RequestLike {
  url?: string;
  method?: string;
  protocol?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
  get?: (name: string) => string | undefined;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: any) => void;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

interface AppLike {
  all: (path: string, handler: (req: RequestLike, res: ResponseLike) => Promise<void>) => void;
}

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

export function registerAuthRoutes(app: AppLike) {
  // Handle all /api/auth/* routes
  app.all("/api/auth/*", async (req: RequestLike, res: ResponseLike) => {
    try {
      // Convert Express request to standard Request object
      const protocol = req.protocol || "https";
      const host = req.get?.("host") || req.headers?.["host"] || "localhost";
      const url = new URL(
        req.url || "/",
        `${protocol}://${host}`
      );

      const headers = new Headers();
      if (req.headers) {
        Object.entries(req.headers).forEach(([key, value]) => {
          if (value) {
            headers.set(key, Array.isArray(value) ? value[0] : String(value));
          }
        });
      }

      const request = new Request(url, {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" 
          ? JSON.stringify(req.body) 
          : undefined,
      });

      // Route to appropriate handler
      let authResponse: globalThis.Response;
      if (req.method === "GET") {
        authResponse = await GET(request);
      } else if (req.method === "POST") {
        authResponse = await POST(request);
      } else {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      // Convert Response to Express response
      const body = await authResponse.text();
      
      // Set status code
      res.status(authResponse.status);

      // Copy headers
      authResponse.headers.forEach((value: string, key: string) => {
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
