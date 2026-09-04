import { Request, Response, NextFunction } from 'express';
import { PreferenceService } from '../services/preferenceService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class PreferenceController {
  public static async getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const preferences = await PreferenceService.getPreferences(
        req.user.id,
        req.user.role,
        targetUserId
      );

      ApiResponse.success(res, 'User preferences retrieved successfully', preferences, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const preferences = await PreferenceService.updatePreferences(
        req.user.id,
        req.user.role,
        req.body,
        targetUserId
      );

      ApiResponse.success(res, 'User preferences updated successfully', preferences, 200);
    } catch (error) {
      next(error);
    }
  }
}
