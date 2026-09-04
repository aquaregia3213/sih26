import { Request, Response, NextFunction } from 'express';
import { AccessibilityService } from '../services/accessibilityService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class AccessibilityController {
  public static async getAccessibilitySettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const settings = await AccessibilityService.getAccessibilitySettings(
        req.user.id,
        req.user.role,
        targetUserId
      );

      ApiResponse.success(res, 'Accessibility settings retrieved successfully', settings, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async updateAccessibilitySettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const targetUserId = req.query.userId as string | undefined;
      const settings = await AccessibilityService.updateAccessibilitySettings(
        req.user.id,
        req.user.role,
        req.body,
        targetUserId
      );

      ApiResponse.success(res, 'Accessibility settings updated successfully', settings, 200);
    } catch (error) {
      next(error);
    }
  }
}
