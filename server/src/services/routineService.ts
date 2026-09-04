import { RoutinePeriod, RoutineCategory } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorMiddleware';

export interface CreateRoutineDto {
  title: string;
  icon?: string;
  scheduledTime: string; // e.g. "08:30" or ISO string
  period?: RoutinePeriod;
  category?: RoutineCategory;
}

export interface UpdateRoutineDto {
  title?: string;
  icon?: string;
  scheduledTime?: string;
  period?: RoutinePeriod;
  category?: RoutineCategory;
  isActive?: boolean;
}

export interface RoutineTaskResponseDto {
  id: string;
  userId: string;
  title: string;
  icon: string;
  scheduledTime: string;
  period: RoutinePeriod;
  category: RoutineCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isCompletedToday?: boolean;
  completedAtToday?: Date | null;
}

export class RoutineService {
  /**
    Helper: Converts string time "HH:mm" or ISO date into a Date object suitable for @db.Time.
   */
  private static parseScheduledTime(timeStr: string): { dateObj: Date; formattedTime: string } {
    if (!timeStr || typeof timeStr !== 'string') {
      throw new AppError('Scheduled time is required', 400);
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    const match = timeStr.trim().match(timeRegex);

    let hours = 8;
    let minutes = 0;

    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
    } else {
      const parsedDate = new Date(timeStr);
      if (isNaN(parsedDate.getTime())) {
        throw new AppError('Invalid time format. Expected "HH:mm" (e.g. "08:30")', 400);
      }
      hours = parsedDate.getHours();
      minutes = parsedDate.getMinutes();
    }

    const dateObj = new Date(1970, 0, 1, hours, minutes, 0);
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { dateObj, formattedTime };
  }

  /**
    Helper: Determines RoutinePeriod from hour if not explicitly provided.
   */
  private static derivePeriod(hours: number): RoutinePeriod {
    if (hours >= 5 && hours < 12) return 'MORNING';
    if (hours >= 12 && hours < 17) return 'AFTERNOON';
    return 'EVENING';
  }

  /**
    Retrieves all routine tasks belonging to the authenticated user.
   */
  public static async getUserRoutines(userId: string): Promise<RoutineTaskResponseDto[]> {
    const tasks = await prisma.routineTask.findMany({
      where: { userId },
      orderBy: [
        { period: 'asc' },
        { scheduledTime: 'asc' },
      ],
    });

    return tasks.map((t) => {
      const timeDate = new Date(t.scheduledTime);
      const hours = String(timeDate.getUTCHours()).padStart(2, '0');
      const mins = String(timeDate.getUTCMinutes()).padStart(2, '0');
      return {
        id: t.id,
        userId: t.userId,
        title: t.title,
        icon: t.icon,
        scheduledTime: `${hours}:${mins}`,
        period: t.period,
        category: t.category,
        isActive: t.isActive,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    });
  }

  /**
    Creates a new routine task for the authenticated user.
   */
  public static async createRoutine(
    userId: string,
    dto: CreateRoutineDto
  ): Promise<RoutineTaskResponseDto> {
    if (!dto.title || typeof dto.title !== 'string' || !dto.title.trim()) {
      throw new AppError('Routine title is required', 400);
    }

    const { dateObj, formattedTime } = this.parseScheduledTime(dto.scheduledTime);
    const period = dto.period || this.derivePeriod(dateObj.getUTCHours());
    const category = dto.category || 'OTHER';

    const newTask = await prisma.routineTask.create({
      data: {
        userId,
        title: dto.title.trim(),
        icon: dto.icon || '📋',
        scheduledTime: dateObj,
        period,
        category,
        isActive: true,
      },
    });

    return {
      id: newTask.id,
      userId: newTask.userId,
      title: newTask.title,
      icon: newTask.icon,
      scheduledTime: formattedTime,
      period: newTask.period,
      category: newTask.category,
      isActive: newTask.isActive,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt,
    };
  }

  /**
    Updates an existing routine task. Enforces strict user ownership.
   */
  public static async updateRoutine(
    userId: string,
    routineId: string,
    dto: UpdateRoutineDto
  ): Promise<RoutineTaskResponseDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routineId);
    if (!isUuid) {
      throw new AppError('Invalid routine ID format', 400);
    }

    const task = await prisma.routineTask.findUnique({
      where: { id: routineId },
    });

    if (!task) {
      throw new AppError('Routine task not found', 404);
    }

    // Ownership check: User can only update their own routine
    if (task.userId !== userId) {
      throw new AppError('Forbidden: Access denied to routine task', 403);
    }

    let dateObj = task.scheduledTime;
    let formattedTime = `${String(new Date(task.scheduledTime).getUTCHours()).padStart(2, '0')}:${String(new Date(task.scheduledTime).getUTCMinutes()).padStart(2, '0')}`;

    if (dto.scheduledTime) {
      const parsed = this.parseScheduledTime(dto.scheduledTime);
      dateObj = parsed.dateObj;
      formattedTime = parsed.formattedTime;
    }

    const updated = await prisma.routineTask.update({
      where: { id: routineId },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.icon && { icon: dto.icon }),
        ...(dto.scheduledTime && { scheduledTime: dateObj }),
        ...(dto.period && { period: dto.period }),
        ...(dto.category && { category: dto.category }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      title: updated.title,
      icon: updated.icon,
      scheduledTime: formattedTime,
      period: updated.period,
      category: updated.category,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
    Deletes (or deactivates) a routine task. Enforces strict user ownership.
   */
  public static async deleteRoutine(
    userId: string,
    routineId: string
  ): Promise<{ message: string; routineId: string }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routineId);
    if (!isUuid) {
      throw new AppError('Invalid routine ID format', 400);
    }

    const task = await prisma.routineTask.findUnique({
      where: { id: routineId },
    });

    if (!task) {
      throw new AppError('Routine task not found', 404);
    }

    // Ownership check
    if (task.userId !== userId) {
      throw new AppError('Forbidden: Access denied to routine task', 403);
    }

    await prisma.routineTask.delete({
      where: { id: routineId },
    });

    return {
      message: 'Routine task deleted successfully',
      routineId,
    };
  }

  /**
    Marks a routine occurrence completed for a target date.
    IDEMPOTENCE GUARANTEE: Repeated calls on the same date return identical completion result without creating duplicate records.
   */
  public static async completeRoutine(
    userId: string,
    routineId: string,
    targetDateStr?: string
  ): Promise<any> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routineId);
    if (!isUuid) {
      throw new AppError('Invalid routine ID format', 400);
    }

    const task = await prisma.routineTask.findUnique({
      where: { id: routineId },
    });

    if (!task) {
      throw new AppError('Routine task not found', 404);
    }

    // Ownership check
    if (task.userId !== userId) {
      throw new AppError('Forbidden: Access denied to routine task', 403);
    }

    if (!task.isActive) {
      throw new AppError('Cannot complete an inactive routine task', 400);
    }

    const dateStr = targetDateStr ? targetDateStr.trim() : new Date().toISOString().split('T')[0];
    const scheduledDateObj = new Date(`${dateStr}T00:00:00.000Z`);

    if (isNaN(scheduledDateObj.getTime())) {
      throw new AppError('Invalid date format for completion. Expected "YYYY-MM-DD"', 400);
    }

    const now = new Date();

    // Idempotent upsert on uq_routine_task_date
    const log = await prisma.routineTaskLog.upsert({
      where: {
        uq_routine_task_date: {
          routineTaskId: routineId,
          scheduledDate: scheduledDateObj,
        },
      },
      update: {
        isCompleted: true,
        completedAt: now,
        completedByUserId: userId,
      },
      create: {
        routineTaskId: routineId,
        userId,
        scheduledDate: scheduledDateObj,
        isCompleted: true,
        completedAt: now,
        completedByUserId: userId,
      },
    });

    return {
      id: log.id,
      routineTaskId: log.routineTaskId,
      userId: log.userId,
      scheduledDate: dateStr,
      isCompleted: log.isCompleted,
      completedAt: log.completedAt,
    };
  }

  /**
    Retrieves Today's Routine tasks grouped by period (MORNING, AFTERNOON, EVENING).
   */
  public static async getTodaysRoutines(
    userId: string,
    targetDateStr?: string
  ): Promise<any> {
    const dateStr = targetDateStr ? targetDateStr.trim() : new Date().toISOString().split('T')[0];
    const scheduledDateObj = new Date(`${dateStr}T00:00:00.000Z`);

    const activeTasks = await prisma.routineTask.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: [
        { period: 'asc' },
        { scheduledTime: 'asc' },
      ],
    });

    const logs = await prisma.routineTaskLog.findMany({
      where: {
        userId,
        scheduledDate: scheduledDateObj,
      },
    });

    const logMap = new Map<string, { isCompleted: boolean; completedAt: Date | null }>();
    logs.forEach((l) => {
      logMap.set(l.routineTaskId, { isCompleted: l.isCompleted, completedAt: l.completedAt });
    });

    const periods: Record<RoutinePeriod, any[]> = {
      MORNING: [],
      AFTERNOON: [],
      EVENING: [],
    };

    let totalTasks = activeTasks.length;
    let completedCount = 0;

    activeTasks.forEach((t) => {
      const timeDate = new Date(t.scheduledTime);
      const hours = String(timeDate.getUTCHours()).padStart(2, '0');
      const mins = String(timeDate.getUTCMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${mins}`;

      const logInfo = logMap.get(t.id);
      const isCompleted = logInfo ? logInfo.isCompleted : false;
      const completedAt = logInfo ? logInfo.completedAt : null;

      if (isCompleted) {
        completedCount++;
      }

      const item = {
        id: t.id,
        title: t.title,
        icon: t.icon,
        scheduledTime: formattedTime,
        period: t.period,
        category: t.category,
        isCompletedToday: isCompleted,
        completedAtToday: completedAt,
      };

      if (periods[t.period]) {
        periods[t.period].push(item);
      } else {
        periods.MORNING.push(item);
      }
    });

    const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100 * 100) / 100 : 0;

    return {
      date: dateStr,
      summary: {
        totalTasks,
        completedCount,
        completionPercentage,
      },
      periods,
    };
  }

  /**
    Retrieves routine completion history with pagination.
   */
  public static async getRoutineHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.routineTaskLog.findMany({
        where: { userId },
        include: {
          routineTask: {
            select: { id: true, title: true, icon: true, period: true, category: true },
          },
        },
        orderBy: { scheduledDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.routineTaskLog.count({
        where: { userId },
      }),
    ]);

    const history = logs.map((l) => ({
      id: l.id,
      routineTaskId: l.routineTaskId,
      title: l.routineTask.title,
      icon: l.routineTask.icon,
      period: l.routineTask.period,
      category: l.routineTask.category,
      scheduledDate: l.scheduledDate.toISOString().split('T')[0],
      isCompleted: l.isCompleted,
      completedAt: l.completedAt,
    }));

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
