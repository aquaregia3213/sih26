import { prisma } from '../config/database';

export interface StreaksResult {
  currentStreak: number;
  longestStreak: number;
}

export class ProgressService {
  /**
    Calculates current and longest streak from sorted unique date strings (YYYY-MM-DD).
    Streak Rule:
      - Multiple sessions on the same calendar day count as 1 active day.
      - Current streak counts consecutive days ending today or yesterday.
      - Longest streak counts the maximum consecutive active days historically.
   */
  public static calculateStreaks(uniqueDateStrs: string[]): StreaksResult {
    if (uniqueDateStrs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort dates ascending
    const sortedDates = [...uniqueDateStrs].sort();

    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    // Calculate current streak ending today or yesterday
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const hasToday = sortedDates.includes(todayStr);
    const hasYesterday = sortedDates.includes(yesterdayStr);

    let currentStreak = 0;

    if (hasToday || hasYesterday) {
      currentStreak = 1;
      let checkDate = new Date(hasToday ? todayStr : yesterdayStr);

      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (sortedDates.includes(dateStr)) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }

    return { currentStreak, longestStreak };
  }

  /**
    Retrieves overall progress summary for the authenticated user.
   */
  public static async getProgressSummary(userId: string): Promise<any> {
    const results = await prisma.gameResult.findMany({
      where: { userId },
      include: {
        game: {
          include: {
            category: true,
          },
        },
        session: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (results.length === 0) {
      return {
        totalCompletedGames: 0,
        totalCompletedSessions: 0,
        averageScore: 0,
        averageAccuracy: 0,
        currentStreak: 0,
        longestStreak: 0,
        recentActivity: [],
        categoryPerformance: [],
        latestCompletedSession: null,
      };
    }

    const totalCompletedSessions = results.length;
    const distinctGameIds = new Set(results.map((r) => r.gameId));
    const totalCompletedGames = distinctGameIds.size;

    const totalScoreSum = results.reduce((sum, r) => sum + r.scoreObtained, 0);
    const averageScore = Math.round(totalScoreSum / totalCompletedSessions);

    const totalAccuracySum = results.reduce((sum, r) => sum + Number(r.accuracyPercentage), 0);
    const averageAccuracy = Math.round((totalAccuracySum / totalCompletedSessions) * 100) / 100;

    // Dates for streak calculation
    const dateStrs = Array.from(
      new Set(results.map((r) => r.createdAt.toISOString().split('T')[0]))
    );
    const { currentStreak, longestStreak } = this.calculateStreaks(dateStrs);

    // Latest session metadata
    const latest = results[0];
    const latestCompletedSession = {
      sessionId: latest.sessionId,
      gameTitle: latest.game.title,
      gameCategory: latest.game.category.name,
      score: latest.scoreObtained,
      accuracy: Number(latest.accuracyPercentage),
      completedAt: latest.createdAt,
    };

    // Recent activity (last 5)
    const recentActivity = results.slice(0, 5).map((r) => ({
      sessionId: r.sessionId,
      gameTitle: r.game.title,
      categorySlug: r.game.category.slug,
      score: r.scoreObtained,
      accuracy: Number(r.accuracyPercentage),
      durationSeconds: r.session.durationSeconds || 0,
      completedAt: r.createdAt,
    }));

    // Category Performance
    const categoryPerformance = await this.getCategoryPerformance(userId);

    return {
      totalCompletedGames,
      totalCompletedSessions,
      averageScore,
      averageAccuracy,
      currentStreak,
      longestStreak,
      recentActivity,
      categoryPerformance,
      latestCompletedSession,
    };
  }

  /**
    Retrieves paginated activity history for the authenticated user.
   */
  public static async getActivityHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      prisma.gameResult.findMany({
        where: { userId },
        include: {
          game: {
            include: {
              category: {
                select: { id: true, slug: true, name: true },
              },
            },
          },
          session: {
            select: { difficultyUsed: true, durationSeconds: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gameResult.count({
        where: { userId },
      }),
    ]);

    const history = results.map((r) => ({
      id: r.id,
      sessionId: r.sessionId,
      gameTitle: r.game.title,
      gameSlug: r.game.slug,
      categoryName: r.game.category.name,
      categorySlug: r.game.category.slug,
      difficulty: r.session.difficultyUsed,
      score: r.scoreObtained,
      accuracy: Number(r.accuracyPercentage),
      durationSeconds: r.session.durationSeconds || 0,
      completedAt: r.createdAt,
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

  /**
    Retrieves category-based performance aggregates.
   */
  public static async getCategoryPerformance(userId: string): Promise<any[]> {
    const categories = await prisma.gameCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    const userResults = await prisma.gameResult.findMany({
      where: { userId },
      include: {
        game: { select: { categoryId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return categories.map((cat) => {
      const catResults = userResults.filter((r) => r.game.categoryId === cat.id);

      if (catResults.length === 0) {
        return {
          categoryId: cat.id,
          slug: cat.slug,
          name: cat.name,
          gamesCompleted: 0,
          averageAccuracy: 0,
          averageScore: 0,
          latestPlayedAt: null,
        };
      }

      const gamesCompleted = catResults.length;
      const totalScore = catResults.reduce((sum, r) => sum + r.scoreObtained, 0);
      const totalAcc = catResults.reduce((sum, r) => sum + Number(r.accuracyPercentage), 0);

      return {
        categoryId: cat.id,
        slug: cat.slug,
        name: cat.name,
        gamesCompleted,
        averageAccuracy: Math.round((totalAcc / gamesCompleted) * 100) / 100,
        averageScore: Math.round(totalScore / gamesCompleted),
        latestPlayedAt: catResults[0].createdAt,
      };
    });
  }

  /**
    Retrieves daily performance trends over 7d, 30d, or 90d periods.
   */
  public static async getPerformanceTrends(
    userId: string,
    period: string = '7d'
  ): Promise<any> {
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };

    const daysCount = daysMap[period.toLowerCase()] || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount + 1);
    startDate.setHours(0, 0, 0, 0);

    const results = await prisma.gameResult.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Build map for each day in range
    const trendMap = new Map<string, { sessionsCompleted: number; totalScore: number; totalAccuracy: number }>();

    for (let i = 0; i < daysCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap.set(dateStr, { sessionsCompleted: 0, totalScore: 0, totalAccuracy: 0 });
    }

    results.forEach((r) => {
      const dateStr = r.createdAt.toISOString().split('T')[0];
      const entry = trendMap.get(dateStr);
      if (entry) {
        entry.sessionsCompleted += 1;
        entry.totalScore += r.scoreObtained;
        entry.totalAccuracy += Number(r.accuracyPercentage);
      }
    });

    const dataPoints = Array.from(trendMap.entries()).map(([date, data]) => {
      const count = data.sessionsCompleted;
      return {
        date,
        sessionsCompleted: count,
        averageScore: count > 0 ? Math.round(data.totalScore / count) : 0,
        averageAccuracy: count > 0 ? Math.round((data.totalAccuracy / count) * 100) / 100 : 0,
      };
    });

    return {
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      dataPoints,
    };
  }
}
