import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import type { User } from "../../drizzle/schema";
import { auth } from "./auth";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";

// Extended request type for compatibility with both Express and Vercel
interface ExtendedRequest {
  protocol?: string;
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: { remoteAddress?: string };
  get?: (name: string) => string | undefined;
  [key: string]: any;
}

// Extended response type for compatibility with both Express and Vercel
interface ExtendedResponse {
  clearCookie?: (name: string, options?: any) => any;
  cookie?: (name: string, value: string, options?: any) => any;
  [key: string]: any;
}

export type TrpcContext = {
  req: ExtendedRequest;
  res: ExtendedResponse;
  user: User | null;
  session: Awaited<ReturnType<typeof auth>> | null;
};

/**
 * Create tRPC context with NextAuth.js session
 * 
 * This function is called for every tRPC request and provides:
 * - The Express request and response objects
 * - The authenticated user from the database (if logged in)
 * - The NextAuth session object
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let session = null;

  try {
    // Get NextAuth session
    session = await auth();

    // If session exists, fetch full user from database
    if (session?.user?.email) {
      const dbInstance = await getDb();
      if (dbInstance) {
        const dbUser = await dbInstance
          .select()
          .from(users)
          .where(eq(users.email, session.user.email))
          .limit(1)
          .then((rows) => rows[0]);

        if (dbUser) {
          user = dbUser;
        }
      }
    }
  } catch (error) {
    console.error("[Context] Authentication error:", error);
    // Authentication is optional for public procedures
    user = null;
    session = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    session,
  };
}
