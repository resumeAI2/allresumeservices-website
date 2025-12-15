import * as Sentry from "@sentry/node";

const SENTRY_DSN = process.env.SENTRY_DSN;

export function initServerSentry() {
  if (!SENTRY_DSN) {
    console.log("[Sentry] Server DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions
    // Only enable in production
    enabled: process.env.NODE_ENV === "production",
  });

  console.log("[Sentry] Server error tracking initialized");
}

export function captureServerError(error: Error, context?: Record<string, unknown>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
  console.error("[Server Error]", error, context);
}

export function captureServerMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
  console.log(`[Server ${level.toUpperCase()}]`, message);
}

export { Sentry };
