import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

/**
 * Request ID Middleware
 * 
 * Adds a unique ID to each request for tracking across logs
 * and debugging production issues.
 * 
 * Usage in logs:
 * console.error(`[${req.id}] Error:`, error);
 */
export function requestIdMiddleware(req: any, res: Response, next: NextFunction) {
  req.id = nanoid(12);
  res.setHeader('X-Request-ID', req.id);
  next();
}
