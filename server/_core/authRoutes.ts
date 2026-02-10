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
 * Serialize an Express-parsed body back to the correct format for the
 * Web API Request object that NextAuth expects.
 *
 * Express body parsers turn the raw body into a JS object. We need to
 * re-serialize it in the format that matches the original Content-Type:
 *   - application/x-www-form-urlencoded → URLSearchParams string
 *   - application/json (or anything else) → JSON string
 */
function serializeBody(
  body: any,
  contentType: string | undefined
): { serialized: string; contentType: string } {
  if (!body || typeof body !== "object") {
    return { serialized: body ? String(body) : "", contentType: contentType || "text/plain" };
  }

  // If the original Content-Type is form-urlencoded, serialize as URLSearchParams
  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null && typeof value !== "object") {
        params.set(key, String(value));
      }
    }
    return {
      serialized: params.toString(),
      contentType: "application/x-www-form-urlencoded",
    };
  }

  // Default: JSON serialize
  return {
    serialized: JSON.stringify(body),
    contentType: contentType || "application/json",
  };
}

/**
 * Register NextAuth.js routes for Express
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

      // Build the Request body with correct Content-Type serialization
      let requestBody: string | undefined;
      if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
        const originalContentType = headers.get("content-type") || undefined;
        const { serialized, contentType } = serializeBody(req.body, originalContentType);
        requestBody = serialized;
        // Ensure the Content-Type header matches the serialization format
        headers.set("content-type", contentType);
      }

      const request = new Request(url, {
        method: req.method,
        headers,
        body: requestBody,
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

      // Copy headers (including Set-Cookie for session tokens)
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
