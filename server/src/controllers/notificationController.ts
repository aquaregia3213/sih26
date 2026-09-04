import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class NotificationController {
  /**
    GET /api/notifications
    Retrieves paginated notifications for the authenticated user.
   */
  public static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await NotificationService.getUserNotifications(req.user.id, {
        page,
        limit,
        unreadOnly,
      });

      ApiResponse.success(res, 'Notifications retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/notifications/unread-count
    Retrieves unread notification count for the authenticated user.
   */
  public static async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const result = await NotificationService.getUnreadCount(req.user.id);
      ApiResponse.success(res, 'Unread notification count retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    PATCH /api/notifications/:id/read
    Marks a notification as read. Enforces strict user ownership.
   */
  public static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const notificationId = req.params.id;

      const updated = await NotificationService.markAsRead(userId, notificationId);
      ApiResponse.success(res, 'Notification marked as read', updated, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    PATCH /api/notifications/read-all
    Marks all notifications for the authenticated user as read.
   */
  public static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const result = await NotificationService.markAllAsRead(req.user.id);
      ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    POST /api/notifications/admin
    Admin endpoint to create a notification for a target user. Requires ADMIN role.
   */
  public static async adminCreateNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      if (req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only Admin accounts can send arbitrary notifications', 403));
      }

      const { userId, type, title, message, severity, icon, actionUrl } = req.body || {};

      const created = await NotificationService.createAdminNotification(req.user.id, {
        userId,
        type,
        title,
        message,
        severity,
        icon,
        actionUrl,
      });

      ApiResponse.success(res, 'Notification created successfully by admin', created, 201);
    } catch (error) {
      next(error);
    }
  }
}
