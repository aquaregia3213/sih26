import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

/**
  Rate-limiting middleware for auth endpoints.
  Allows max 15 requests per IP address within a 15-minute window.
 */
export function authRateLimiter(maxRequests: number = 15, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = store.get(ip);

    if (!record) {
      store.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      store.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec.toString());
      ApiResponse.error(
        res,
        'Too many login attempts. Please try again after 15 minutes.',
        429,
        { retryAfterSeconds: retryAfterSec }
      );
      return;
    }

    record.count += 1;
    next();
  };
}
