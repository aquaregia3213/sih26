import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/authUtils';
import { ApiResponse } from '../utils/apiResponse';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
  Authentication middleware enforcing valid JWT Bearer token.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Authentication token missing or malformed', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    ApiResponse.error(res, 'Invalid, expired, or revoked authentication token', 401);
  }
}
