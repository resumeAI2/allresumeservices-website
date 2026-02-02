import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthConfig, Session, User, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { z } from "zod";
import { getDb } from "../db";
import { users, accounts, sessions, verificationTokens } from "../../drizzle/schema";
import { ENV } from "./env";

/**
 * NextAuth.js v5 Configuration
 * 
 * Supports:
 * - Email/Password authentication with bcrypt
 * - Google OAuth
 * - GitHub OAuth
 * - Automatic admin role assignment based on ADMIN_EMAIL
 */

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authConfig: NextAuthConfig = {
  // We handle database operations manually in callbacks
  // adapter: undefined,

  // Session strategy - use JWT for serverless compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Authentication providers
  providers: [
    // Email/Password authentication
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials);

          const authDb = await getDb();
          if (!authDb) {
            throw new Error("Database not available");
          }

          // Find user by email
          const user = await authDb
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .then((rows) => rows[0]);

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Check if user has a password (might be OAuth-only user)
          if (!user.password) {
            throw new Error("Please sign in with your social account");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          const updateDb = await getDb();
          if (updateDb) {
            // Update last signed in
            await updateDb
              .update(users)
              .set({ lastSignedIn: new Date() })
              .where(eq(users.id, user.id));
          }

          // Return user object (password excluded)
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Login error:", error);
          return null;
        }
      },
    }),

    // Google OAuth
    Google({
      clientId: ENV.googleClientId,
      clientSecret: ENV.googleClientSecret,
      allowDangerousEmailAccountLinking: false,
    }),

    // GitHub OAuth
    GitHub({
      clientId: ENV.githubClientId,
      clientSecret: ENV.githubClientSecret,
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  // Callbacks for customizing behavior
  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user, account, trigger }: { token: JWT; user?: User; account?: Account | null; trigger?: "signIn" | "signUp" | "update" }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.email = user.email;
        token.name = user.name;

        const jwtDb = await getDb();
        if (jwtDb) {
          // Assign admin role if email matches ADMIN_EMAIL
          if (user.email === ENV.adminEmail) {
            token.role = "admin";
            
            // Update user role in database
            await jwtDb
              .update(users)
              .set({ role: "admin" })
              .where(eq(users.email, user.email!));
          }

          // Track login method
          if (account) {
            await jwtDb
              .update(users)
              .set({ 
                loginMethod: account.provider,
                lastSignedIn: new Date(),
              })
              .where(eq(users.email, user.email!));
          }
        }
      }

      // Update trigger (e.g., session update)
      if (trigger === "update") {
        const updateDb = await getDb();
        if (updateDb) {
          // Refresh user data from database
          const dbUser = await updateDb
            .select()
            .from(users)
            .where(eq(users.email, token.email as string))
            .limit(1)
            .then((rows) => rows[0]);

          if (dbUser) {
            token.role = dbUser.role;
            token.name = dbUser.name;
          }
        }
      }

      return token;
    },

    // Session callback - runs when session is checked
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as "user" | "admin";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    // Sign in callback - control who can sign in
    async signIn({ user, account, profile }: { user: User; account?: Account | null; profile?: any }) {
      // For OAuth providers, create user if doesn't exist
      if (account?.provider !== "credentials") {
        const signInDb = await getDb();
        if (signInDb) {
          const existingUser = await signInDb
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1)
            .then((rows) => rows[0]);

          if (!existingUser) {
            // Create new user for OAuth sign-in
            const isAdmin = user.email === ENV.adminEmail;
            
            await signInDb.insert(users).values({
              email: user.email!,
              name: user.name || null,
              image: user.image || null,
              emailVerified: new Date(),
              loginMethod: account?.provider,
              role: isAdmin ? "admin" : "user",
              lastSignedIn: new Date(),
            });
          }
        }
      }

      return true;
    },
  },

  // Pages configuration
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Events for logging
  events: {
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      console.log(`[Auth] User signed in: ${user.email} via ${account?.provider || "credentials"}`);
    },
    async signOut(message: any) {
      console.log(`[Auth] User signed out: ${message?.token?.email}`);
    },
  },

  // Security settings
  secret: ENV.authSecret,
  trustHost: true, // Required for Vercel deployment
};
