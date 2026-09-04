import { DifficultyLevel } from '@prisma/client';

export interface RecommendationResultDto {
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  categorySlug: string;
  categoryName: string;
  recommendedDifficulty: DifficultyLevel;
  recommendationReason: string;
  limitedHistory: boolean;
  confidenceScore?: number;
}

export interface CategoryPerformanceSignal {
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  gamesCompleted: number;
  averageAccuracy: number;
  latestPlayedAt: Date | null;
}

export interface PerformanceSignals {
  totalCompletedSessions: number;
  recentAccuracy: number; // 0 - 100 percentage
  recentScore: number;
  overallAverageAccuracy: number;
  recentDifficulty: DifficultyLevel;
  recentConsecutiveStrong: number; // sessions with >= 80% accuracy
  recentConsecutiveWeak: number;   // sessions with < 50% accuracy
  lastPlayedCategoryId?: string;
  lastPlayedGameId?: string;
  categorySignals: CategoryPerformanceSignal[];
}

export abstract class RecommendationEngine {
  /**
    Abstract method contract for computing the next personalized activity recommendation.
   */
  public abstract getNextRecommendation(userId: string): Promise<RecommendationResultDto | null>;
}
