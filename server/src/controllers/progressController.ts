import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services/progressService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class ProgressController {
  public static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const summary = await ProgressService.getProgressSummary(req.user.id);
      ApiResponse.success(res, 'Progress summary retrieved successfully', summary, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);

      const history = await ProgressService.getActivityHistory(req.user.id, page, limit);
      ApiResponse.success(res, 'Activity history retrieved successfully', history, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const categoryPerformance = await ProgressService.getCategoryPerformance(req.user.id);
      ApiResponse.success(res, 'Category performance retrieved successfully', categoryPerformance, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const period = (req.query.period as string) || '7d';
      const trends = await ProgressService.getPerformanceTrends(req.user.id, period);
      ApiResponse.success(res, 'Performance trends retrieved successfully', trends, 200);
    } catch (error) {
      next(error);
    }
  }
}
