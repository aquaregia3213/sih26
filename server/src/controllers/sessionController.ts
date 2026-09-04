import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/sessionService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class SessionController {
  public static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const result = await SessionService.createSession(req.user.id, req.body);
      ApiResponse.success(res, 'Game session started successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const { id } = req.params;
      const session = await SessionService.getSessionById(req.user.id, id);
      ApiResponse.success(res, 'Game session retrieved successfully', session, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const { id } = req.params;
      const result = await SessionService.submitAnswer(req.user.id, id, req.body);
      ApiResponse.success(res, 'Answer submitted successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async completeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const { id } = req.params;
      const result = await SessionService.completeSession(req.user.id, id);
      ApiResponse.success(res, 'Game session completed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getSessionHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);

      const history = await SessionService.getSessionHistory(req.user.id, page, limit);
      ApiResponse.success(res, 'Game session history retrieved successfully', history, 200);
    } catch (error) {
      next(error);
    }
  }
}
