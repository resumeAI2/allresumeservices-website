import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/**
 * Custom hook for authentication
 * 
 * Provides:
 * - Current user data from database
 * - Loading and error states
 * - Logout functionality
 * - Optional redirect for unauthenticated users
 */
export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      // 1. Clear tRPC app session cookie
      try {
        await logoutMutation.mutateAsync();
      } catch (error: unknown) {
        // Ignore UNAUTHORIZED - means already logged out
        if (
          !(error instanceof TRPCClientError &&
            error.data?.code === "UNAUTHORIZED")
        ) {
          console.error("[Auth] tRPC logout error:", error);
        }
      }

      // 2. Clear NextAuth session by POSTing to the signout endpoint.
      //    This is the only reliable way to clear the authjs.session-token cookie.
      try {
        const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
        const { csrfToken } = await csrfRes.json();

        await fetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          redirect: "manual",
          body: new URLSearchParams({ csrfToken }),
        });
      } catch {
        // Best-effort — signout endpoint may fail but we'll still redirect
        console.error("[Auth] NextAuth signout request failed");
      }

      // 3. Clean up local state
      localStorage.removeItem("user-info");
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      
      // Redirect to login page
      globalThis.location.href = "/login";
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    // Store user info in local storage for persistence
    if (meQuery.data) {
      localStorage.setItem("user-info", JSON.stringify(meQuery.data));
    }
    
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof globalThis === "undefined") return;
    if (globalThis.location.pathname === redirectPath) return;

    globalThis.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
