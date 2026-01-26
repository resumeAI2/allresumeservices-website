import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * NextAuth.js v5 initialization
 * 
 * This file exports the main auth handlers and helper functions
 * for authentication throughout the application.
 */

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

/**
 * Get the current authenticated user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized - authentication required");
  }
  return user;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Forbidden - admin access required");
  }
  return user;
}
