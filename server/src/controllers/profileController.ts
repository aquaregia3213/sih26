import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profileService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const profile = await ProfileService.getProfile(req.user.id, req.user.role, targetUserId);

      ApiResponse.success(res, 'User profile retrieved successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const profile = await ProfileService.updateProfile(
        req.user.id,
        req.user.role,
        req.body,
        targetUserId
      );

      ApiResponse.success(res, 'User profile updated successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }
}
