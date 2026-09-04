import { Request, Response, NextFunction } from 'express';
import { RoutineService } from '../services/routineService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class RoutineController {
  /**
    GET /api/routines
    Retrieves all routine tasks belonging to the authenticated user.
   */
  public static async getUserRoutines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const routines = await RoutineService.getUserRoutines(req.user.id);
      ApiResponse.success(res, 'User routines retrieved successfully', routines, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    POST /api/routines
    Creates a new routine task for the authenticated user.
   */
  public static async createRoutine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const { title, icon, scheduledTime, period, category } = req.body || {};

      const routine = await RoutineService.createRoutine(userId, {
        title,
        icon,
        scheduledTime,
        period,
        category,
      });

      ApiResponse.success(res, 'Routine task created successfully', routine, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/routines/today
    Retrieves today's routine tasks grouped by period for the authenticated user.
   */
  public static async getTodaysRoutines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const dateStr = req.query.date as string | undefined;
      const todaysRoutines = await RoutineService.getTodaysRoutines(req.user.id, dateStr);

      ApiResponse.success(res, "Today's routines retrieved successfully", todaysRoutines, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/routines/history
    Retrieves paginated routine completion history for the authenticated user.
   */
  public static async getRoutineHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);

      const history = await RoutineService.getRoutineHistory(req.user.id, page, limit);
      ApiResponse.success(res, 'Routine history retrieved successfully', history, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    PATCH /api/routines/:id
    Updates an existing routine task owned by the authenticated user.
   */
  public static async updateRoutine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const routineId = req.params.id;

      const updated = await RoutineService.updateRoutine(userId, routineId, req.body || {});
      ApiResponse.success(res, 'Routine task updated successfully', updated, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    DELETE /api/routines/:id
    Deletes a routine task owned by the authenticated user.
   */
  public static async deleteRoutine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const routineId = req.params.id;

      const result = await RoutineService.deleteRoutine(userId, routineId);
      ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    POST /api/routines/:id/complete
    Marks a routine task completed for today (or a specified date). Idempotent.
   */
  public static async completeRoutine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const routineId = req.params.id;
      const { scheduledDate } = req.body || {};

      const result = await RoutineService.completeRoutine(userId, routineId, scheduledDate);
      ApiResponse.success(res, 'Routine marked completed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }
}
