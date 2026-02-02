/**
 * Structured Logger
 * 
 * Replaces console.log with structured, production-ready logging
 * that integrates with monitoring services (Sentry).
 */

import * as Sentry from '@sentry/node';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: number;
  requestId?: string;
  duration?: number;
  statusCode?: number;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  private enableDebug = process.env.DEBUG === 'true';

  /**
   * Format log entry as JSON for easy parsing
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    });
  }

  /**
   * Debug logs - only shown in development or when DEBUG=true
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment || this.enableDebug) {
      console.debug(this.formatLog('debug', message, context));
    }
  }

  /**
   * Info logs - general information
   */
  info(message: string, context?: LogContext): void {
    console.info(this.formatLog('info', message, context));
  }

  /**
   * Warning logs - something unexpected but not critical
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog('warn', message, context));
    
    if (this.isProduction) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  }

  /**
   * Error logs - critical issues that need attention
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorInfo = error instanceof Error
      ? { error: error.message, stack: error.stack }
      : { error: String(error) };

    console.error(this.formatLog('error', message, { ...errorInfo, ...context }));
    
    if (this.isProduction && error instanceof Error) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  }

  /**
   * Log HTTP requests
   */
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, context);
  }

  /**
   * Log slow operations (>1 second)
   */
  slow(operation: string, duration: number, context?: LogContext): void {
    this.warn(`Slow operation: ${operation}`, { duration, ...context });
  }

  /**
   * Log security events
   */
  security(event: string, context?: LogContext): void {
    this.warn(`[SECURITY] ${event}`, context);
    
    // Always send security events to Sentry, even in development
    Sentry.captureMessage(`Security: ${event}`, {
      level: 'warning',
      tags: { type: 'security' },
      extra: context,
    });
  }
}

export const logger = new Logger();

/**
 * Legacy console.log wrapper
 * Use this to gradually migrate from console.log to structured logging
 */
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
};
