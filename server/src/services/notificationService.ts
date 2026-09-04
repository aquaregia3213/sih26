import { NotificationType, NotificationSeverity } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorMiddleware';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  severity?: NotificationSeverity;
  icon?: string;
  actionUrl?: string;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  icon: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export class NotificationService {
  /**
    Internal helper method for creating backend notifications.
    Callable by internal services (routines, game sessions, admin).
   */
  public static async createNotification(input: CreateNotificationInput): Promise<NotificationDto> {
    if (!input.userId) {
      throw new AppError('User ID is required for notification creation', 400);
    }
    if (!input.title || !input.title.trim()) {
      throw new AppError('Notification title is required', 400);
    }
    if (!input.message || !input.message.trim()) {
      throw new AppError('Notification message is required', 400);
    }

    // Verify target user exists
    const userExists = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { id: true },
    });

    if (!userExists) {
      throw new AppError('Target user for notification not found', 404);
    }

    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type || 'SYSTEM',
        severity: input.severity || 'INFO',
        title: input.title.trim(),
        message: input.message.trim(),
        icon: input.icon || '🔔',
        actionUrl: input.actionUrl || null,
        isRead: false,
      },
    });

    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      severity: notification.severity,
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      actionUrl: notification.actionUrl,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }

  /**
    Admin endpoint method: Allows ADMIN users to send notifications.
   */
  public static async createAdminNotification(
    adminUserId: string,
    input: CreateNotificationInput
  ): Promise<NotificationDto> {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      throw new AppError('Forbidden: Only Admin accounts can send notifications directly', 403);
    }

    return this.createNotification(input);
  }

  /**
    Retrieves paginated notifications for the authenticated user (newest first).
   */
  public static async getUserNotifications(
    userId: string,
    options: GetNotificationsOptions = {}
  ): Promise<any> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;
    const unreadOnly = options.unreadOnly === true;

    const whereCondition: any = {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereCondition }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    const data: NotificationDto[] = notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      type: n.type,
      severity: n.severity,
      title: n.title,
      message: n.message,
      icon: n.icon,
      actionUrl: n.actionUrl,
      isRead: n.isRead,
      readAt: n.readAt,
      createdAt: n.createdAt,
    }));

    return {
      notifications: data,
      summary: {
        unreadCount,
        total,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
    Returns simple count of unread notifications for the authenticated user.
   */
  public static async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unreadCount };
  }

  /**
    Marks a single notification as read. Strictly enforces user ownership.
    IDEMPOTENT: Re-marking an already-read notification returns the notification without error.
   */
  public static async markAsRead(userId: string, notificationId: string): Promise<NotificationDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(notificationId);
    if (!isUuid) {
      throw new AppError('Invalid notification ID format', 400);
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    // Ownership check: User can only mark their own notification as read
    if (notification.userId !== userId) {
      throw new AppError('Forbidden: Access denied to notification', 403);
    }

    if (notification.isRead) {
      return {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        severity: notification.severity,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        actionUrl: notification.actionUrl,
        isRead: notification.isRead,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      };
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      type: updated.type,
      severity: updated.severity,
      title: updated.title,
      message: updated.message,
      icon: updated.icon,
      actionUrl: updated.actionUrl,
      isRead: updated.isRead,
      readAt: updated.readAt,
      createdAt: updated.createdAt,
    };
  }

  /**
    Marks all notifications for the authenticated user as read. Idempotent.
   */
  public static async markAllAsRead(userId: string): Promise<{ message: string; count: number }> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      message: 'All notifications marked as read',
      count: result.count,
    };
  }
}
