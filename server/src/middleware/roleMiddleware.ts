import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { ApiResponse } from '../utils/apiResponse';

export type AllowedRole = UserRole | 'ELDERLY';

/**
  Role-based authorization middleware.
  Ensures authenticated user possesses one of the permitted roles.
 */
export function requireRole(...allowedRoles: AllowedRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 'Authentication required', 401);
      return;
    }

    const normalizedAllowedRoles = allowedRoles.map((r) =>
      r === 'ELDERLY' ? 'ELDER' : r
    );

    const userRole = req.user.role === ('ELDERLY' as any) ? 'ELDER' : req.user.role;

    if (!normalizedAllowedRoles.includes(userRole)) {
      ApiResponse.error(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
}
