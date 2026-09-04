import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.success(
        res,
        'Account registered successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(
        res,
        'Login successful',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      // Always use req.user.id from verified JWT — NEVER trust client payload IDs
      const user = await AuthService.getCurrentUser(req.user.id);
      ApiResponse.success(
        res,
        'Authenticated user profile retrieved',
        user,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
