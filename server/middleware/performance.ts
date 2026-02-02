import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Performance Monitoring Middleware
 * 
 * Tracks request duration and logs slow operations
 * Helps identify performance bottlenecks in production
 */

interface PerformanceMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ip?: string;
}

const SLOW_REQUEST_THRESHOLD = 1000; // 1 second
const VERY_SLOW_REQUEST_THRESHOLD = 5000; // 5 seconds

export function performanceMonitoring(req: any, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = req.id || 'unknown';

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const metrics: PerformanceMetrics = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };

    // Log based on severity
    if (duration > VERY_SLOW_REQUEST_THRESHOLD) {
      logger.error('Very slow request detected', undefined, {
        ...metrics,
        requestId,
        severity: 'critical',
      });
    } else if (duration > SLOW_REQUEST_THRESHOLD) {
      logger.warn('Slow request detected', {
        ...metrics,
        requestId,
        severity: 'warning',
      });
    } else if (process.env.DEBUG === 'true') {
      logger.debug('Request completed', {
        ...metrics,
        requestId,
      });
    }

    // Track error responses
    if (res.statusCode >= 500) {
      logger.error('Server error response', undefined, {
        ...metrics,
        requestId,
      });
    } else if (res.statusCode >= 400) {
      logger.warn('Client error response', {
        ...metrics,
        requestId,
      });
    }
  });

  next();
}

/**
 * Measure async operation performance
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;

    if (duration > SLOW_REQUEST_THRESHOLD) {
      logger.slow(operation, duration);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`Operation failed: ${operation}`, error as Error, { duration });
    throw error;
  }
}

/**
 * Database query performance tracker
 */
export function trackQueryPerformance<T>(
  query: string,
  fn: () => Promise<T>
): Promise<T> {
  return measurePerformance(`DB Query: ${query}`, fn);
}

/**
 * External API call performance tracker
 */
export function trackApiCall<T>(
  service: string,
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  return measurePerformance(`API Call: ${service} - ${endpoint}`, fn);
}
