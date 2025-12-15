import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log("[Sentry] DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions for replay
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    // Only send errors in production
    enabled: import.meta.env.PROD,
  });

  console.log("[Sentry] Error tracking initialized");
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
  console.error("[Error]", error, context);
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
  console.log(`[${level.toUpperCase()}]`, message);
}

export { Sentry };
