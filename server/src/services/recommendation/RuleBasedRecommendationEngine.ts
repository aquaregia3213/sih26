import { DifficultyLevel } from '@prisma/client';
import { prisma } from '../../config/database';
import {
  RecommendationEngine,
  RecommendationResultDto,
  PerformanceSignals,
  CategoryPerformanceSignal,
} from './RecommendationEngine';

export class RuleBasedRecommendationEngine extends RecommendationEngine {
  private static readonly WINDOW_SIZE = 10;
  private static readonly RECENT_WINDOW = 5;

  /**
    Extracts real performance signals bounded by a max window of 10 recent completed sessions.
   */
  public async extractPerformanceSignals(userId: string): Promise<PerformanceSignals> {
    const recentResults = await prisma.gameResult.findMany({
      where: { userId },
      include: {
        game: {
          select: { id: true, categoryId: true, baseDifficulty: true },
        },
        session: {
          select: { difficultyUsed: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: RuleBasedRecommendationEngine.WINDOW_SIZE,
    });

    const totalCompletedSessions = await prisma.gameResult.count({
      where: { userId },
    });

    if (recentResults.length === 0) {
      const categories = await prisma.gameCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      });

      return {
        totalCompletedSessions: 0,
        recentAccuracy: 0,
        recentScore: 0,
        overallAverageAccuracy: 0,
        recentDifficulty: 'EASY',
        recentConsecutiveStrong: 0,
        recentConsecutiveWeak: 0,
        categorySignals: categories.map((cat) => ({
          categoryId: cat.id,
          categorySlug: cat.slug,
          categoryName: cat.name,
          gamesCompleted: 0,
          averageAccuracy: 0,
          latestPlayedAt: null,
        })),
      };
    }

    const lastResult = recentResults[0];
    const lastPlayedGameId = lastResult.gameId;
    const lastPlayedCategoryId = lastResult.game.categoryId;
    const recentDifficulty = lastResult.session.difficultyUsed || 'EASY';

    // Bounded recent window (up to 5 sessions)
    const recentSlice = recentResults.slice(0, RuleBasedRecommendationEngine.RECENT_WINDOW);
    const recentAccSum = recentSlice.reduce((sum, r) => sum + Number(r.accuracyPercentage), 0);
    const recentScoreSum = recentSlice.reduce((sum, r) => sum + r.scoreObtained, 0);
    const recentAccuracy = Math.round((recentAccSum / recentSlice.length) * 100) / 100;
    const recentScore = Math.round(recentScoreSum / recentSlice.length);

    // Overall window average (up to 10 sessions)
    const windowAccSum = recentResults.reduce((sum, r) => sum + Number(r.accuracyPercentage), 0);
    const overallAverageAccuracy = Math.round((windowAccSum / recentResults.length) * 100) / 100;

    // Consecutive strong (>= 80%) / weak (< 50%) streaks from most recent
    let recentConsecutiveStrong = 0;
    for (const res of recentResults) {
      if (Number(res.accuracyPercentage) >= 80) {
        recentConsecutiveStrong += 1;
      } else {
        break;
      }
    }

    let recentConsecutiveWeak = 0;
    for (const res of recentResults) {
      if (Number(res.accuracyPercentage) < 50) {
        recentConsecutiveWeak += 1;
      } else {
        break;
      }
    }

    // Category signals
    const categories = await prisma.gameCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    const categorySignals: CategoryPerformanceSignal[] = categories.map((cat) => {
      const catResults = recentResults.filter((r) => r.game.categoryId === cat.id);
      if (catResults.length === 0) {
        return {
          categoryId: cat.id,
          categorySlug: cat.slug,
          categoryName: cat.name,
          gamesCompleted: 0,
          averageAccuracy: 0,
          latestPlayedAt: null,
        };
      }

      const accSum = catResults.reduce((sum, r) => sum + Number(r.accuracyPercentage), 0);
      return {
        categoryId: cat.id,
        categorySlug: cat.slug,
        categoryName: cat.name,
        gamesCompleted: catResults.length,
        averageAccuracy: Math.round((accSum / catResults.length) * 100) / 100,
        latestPlayedAt: catResults[0].createdAt,
      };
    });

    return {
      totalCompletedSessions,
      recentAccuracy,
      recentScore,
      overallAverageAccuracy,
      recentDifficulty,
      recentConsecutiveStrong,
      recentConsecutiveWeak,
      lastPlayedCategoryId,
      lastPlayedGameId,
      categorySignals,
    };
  }

  /**
    Determines recommended difficulty using rule-based hysteresis stability.
   */
  public determineDifficulty(signals: PerformanceSignals, gameBaseDifficulty: DifficultyLevel): {
    recommendedDifficulty: DifficultyLevel;
    reasonSuffix: string;
  } {
    // New or limited history user (0 or 1 session)
    if (signals.totalCompletedSessions <= 1) {
      return {
        recommendedDifficulty: gameBaseDifficulty || 'EASY',
        reasonSuffix: 'Starter activity recommended based on your initial baseline.',
      };
    }

    const currentDiff = signals.recentDifficulty;

    // Sustained Strong Performance
    if (currentDiff === 'EASY') {
      if (signals.recentAccuracy >= 80 && signals.recentConsecutiveStrong >= 2) {
        return {
          recommendedDifficulty: 'MEDIUM',
          reasonSuffix: 'Sustained strong performance! Advancing to Medium difficulty.',
        };
      }
    } else if (currentDiff === 'MEDIUM') {
      if (signals.recentAccuracy >= 85 && signals.recentConsecutiveStrong >= 3) {
        return {
          recommendedDifficulty: 'HARD',
          reasonSuffix: 'Sustained high accuracy across recent sessions! Advancing to Hard challenge.',
        };
      }
      // Sustained Weak Performance drop to EASY
      if (signals.recentAccuracy < 50 && signals.recentConsecutiveWeak >= 2) {
        return {
          recommendedDifficulty: 'EASY',
          reasonSuffix: 'Recent performance is below your average. Adjusting to Easy difficulty for steady practice.',
        };
      }
    } else if (currentDiff === 'HARD') {
      if (signals.recentAccuracy < 50 && signals.recentConsecutiveWeak >= 2) {
        return {
          recommendedDifficulty: 'MEDIUM',
          reasonSuffix: 'Recent performance is below your average. Adjusting to Medium difficulty to reinforce core concepts.',
        };
      }
    }

    // Stable performance fallback - maintain current difficulty
    return {
      recommendedDifficulty: currentDiff,
      reasonSuffix: 'Maintaining current difficulty for consistent cognitive practice.',
    };
  }

  /**
    Selects target category based on recency, category performance, and diversity.
   */
  public selectCategory(signals: PerformanceSignals): {
    selectedCategoryId: string;
    categoryReason: string;
  } {
    const { categorySignals, lastPlayedCategoryId } = signals;

    // Filter categories that have active games with content
    if (categorySignals.length === 0) {
      throw new Error('No categories available');
    }

    // 1. Look for unpracticed categories
    const unpracticed = categorySignals.filter((c) => c.gamesCompleted === 0);
    if (unpracticed.length > 0) {
      const selected = unpracticed[0];
      return {
        selectedCategoryId: selected.categoryId,
        categoryReason: `Less recently practiced activity in ${selected.categoryName}.`,
      };
    }

    // 2. Look for categories excluding last played category if alternatives exist
    const candidates = categorySignals.filter((c) => c.categoryId !== lastPlayedCategoryId);
    const pool = candidates.length > 0 ? candidates : categorySignals;

    // 3. Find category with performance below average
    const belowAvg = pool.filter((c) => c.averageAccuracy < signals.overallAverageAccuracy);
    if (belowAvg.length > 0) {
      belowAvg.sort((a, b) => a.averageAccuracy - b.averageAccuracy);
      const selected = belowAvg[0];
      return {
        selectedCategoryId: selected.categoryId,
        categoryReason: `Recent performance in ${selected.categoryName} is below your recent average. A different activity may be useful next.`,
      };
    }

    // 4. Fallback: select least recently played category
    pool.sort((a, b) => {
      const timeA = a.latestPlayedAt ? new Date(a.latestPlayedAt).getTime() : 0;
      const timeB = b.latestPlayedAt ? new Date(b.latestPlayedAt).getTime() : 0;
      return timeA - timeB;
    });

    const selected = pool[0];
    return {
      selectedCategoryId: selected.categoryId,
      categoryReason: `A different activity in ${selected.categoryName} may be useful next to maintain balanced practice.`,
    };
  }

  /**
    Computes and returns the next activity recommendation.
   */
  public async getNextRecommendation(userId: string): Promise<RecommendationResultDto | null> {
    const signals = await this.extractPerformanceSignals(userId);

    // Get all active games with playable content items
    const activeGamesWithContent = await prisma.game.findMany({
      where: {
        isActive: true,
        category: {
          // category must exist
        },
        contentItems: {
          some: {}, // Must have at least 1 playable content item
        },
      },
      include: {
        category: true,
      },
    });

    if (activeGamesWithContent.length === 0) {
      return null; // Safe fallback: no playable games exist
    }

    // Update signals category filter to only include categories with playable content
    const playableCategoryIds = new Set(activeGamesWithContent.map((g) => g.categoryId));
    signals.categorySignals = signals.categorySignals.filter((c) => playableCategoryIds.has(c.categoryId));

    if (signals.categorySignals.length === 0) {
      return null;
    }

    let selectedCategoryId: string;
    let categoryReason: string;

    try {
      const catSelection = this.selectCategory(signals);
      selectedCategoryId = catSelection.selectedCategoryId;
      categoryReason = catSelection.categoryReason;
    } catch {
      selectedCategoryId = activeGamesWithContent[0].categoryId;
      categoryReason = 'Recommended activity for daily wellness practice.';
    }

    // Filter games in selected category
    let categoryGames = activeGamesWithContent.filter((g) => g.categoryId === selectedCategoryId);

    // If no playable games in selected category, fallback to any playable game
    if (categoryGames.length === 0) {
      categoryGames = activeGamesWithContent;
    }

    // Reduce repetition: avoid exact last played game if alternatives exist
    let candidateGames = categoryGames;
    if (categoryGames.length > 1 && signals.lastPlayedGameId) {
      const nonRepeated = categoryGames.filter((g) => g.id !== signals.lastPlayedGameId);
      if (nonRepeated.length > 0) {
        candidateGames = nonRepeated;
      }
    }

    const targetGame = candidateGames[0];

    // Determine difficulty
    const { recommendedDifficulty, reasonSuffix } = this.determineDifficulty(
      signals,
      targetGame.baseDifficulty
    );

    const limitedHistory = signals.totalCompletedSessions <= 1;
    const confidenceScore = limitedHistory ? 0.6 : 0.85;

    const recommendationReason = limitedHistory
      ? `Starter activity in ${targetGame.category.name}. ${reasonSuffix}`
      : `${categoryReason} ${reasonSuffix}`;

    return {
      gameId: targetGame.id,
      gameSlug: targetGame.slug,
      gameTitle: targetGame.title,
      categorySlug: targetGame.category.slug,
      categoryName: targetGame.category.name,
      recommendedDifficulty,
      recommendationReason,
      limitedHistory,
      confidenceScore,
    };
  }
}
