import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorMiddleware';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const windowMs = 15 * 60 * 1000; // 15 minute sliding window
const maxRequestsPerWindow = 30;  // Max 30 AI requests per 15 minutes per user/IP
const store = new Map<string, RateLimitStore>();

/**
  Simple, lightweight, zero-dependency Rate Limiter for AI endpoints.
  Prevents prompt abuse and protects Gemini API quota.
 */
export function aiRateLimiter(req: Request, _res: Response, next: NextFunction): void {
  const identifier = req.user?.id || req.ip || 'anonymous';
  const now = Date.now();

  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (record.count >= maxRequestsPerWindow) {
    return next(new AppError('Too many AI companion requests. Please wait a few minutes before trying again.', 429));
  }

  record.count++;
  return next();
}
