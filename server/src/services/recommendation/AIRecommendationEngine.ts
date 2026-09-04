import { RecommendationEngine, RecommendationResultDto } from './RecommendationEngine';
import { RuleBasedRecommendationEngine } from './RuleBasedRecommendationEngine';
import { ProgressService } from '../progressService';
import { GameService } from '../gameService';
import { GeminiService } from '../ai/geminiService';
import { EligibleGameOption, UserPersonalizationFeatures } from '../ai/aiTypes';

export class AIRecommendationEngine extends RecommendationEngine {
  private fallbackEngine: RuleBasedRecommendationEngine = new RuleBasedRecommendationEngine();

  /**
    Computes personalized activity recommendation using Gemini AI with automatic Rule-Based fallback.
   */
  public async getNextRecommendation(userId: string): Promise<RecommendationResultDto | null> {
    try {
      // Step 1: Fetch user performance signals
      const signals = await this.fallbackEngine.extractPerformanceSignals(userId);

      // Step 2: Fetch active games with content
      const games = await GameService.getGames();
      const eligibleGames: EligibleGameOption[] = games
        .filter((g) => g.isActive)
        .map((g) => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          categorySlug: g.category.slug,
          categoryName: g.category.name,
          baseDifficulty: g.baseDifficulty,
        }));

      if (eligibleGames.length === 0) {
        return this.fallbackEngine.getNextRecommendation(userId);
      }

      // Step 3: Anonymized feature payload
      const userFeatures: UserPersonalizationFeatures = {
        totalCompletedSessions: signals.totalCompletedSessions,
        recentAccuracy: signals.recentAccuracy,
        recentDifficulty: signals.recentDifficulty,
        recentConsecutiveStrong: signals.recentConsecutiveStrong,
        recentConsecutiveWeak: signals.recentConsecutiveWeak,
        lastPlayedCategorySlug: signals.lastPlayedCategoryId,
        categoryAccuracies: signals.categorySignals.map((cs) => ({
          categorySlug: cs.categorySlug,
          gamesCompleted: cs.gamesCompleted,
          accuracy: cs.averageAccuracy,
        })),
      };

      // Step 4: Invoke Gemini Service
      const aiResult = await GeminiService.generateStructuredRecommendation({
        userFeatures,
        eligibleGames,
      });

      // Step 5: Independent Server-Side Validation
      if (!aiResult) {
        return this.fallbackEngine.getNextRecommendation(userId);
      }

      const matchedGame = games.find((g) => g.id === aiResult.recommendedGameId);
      if (!matchedGame || !matchedGame.isActive) {
        return this.fallbackEngine.getNextRecommendation(userId);
      }

      return {
        gameId: matchedGame.id,
        gameSlug: matchedGame.slug,
        gameTitle: matchedGame.title,
        categorySlug: matchedGame.category.slug,
        categoryName: matchedGame.category.name,
        recommendedDifficulty: aiResult.recommendedDifficulty as any,
        recommendationReason: aiResult.reason,
        limitedHistory: signals.totalCompletedSessions < 3,
        confidenceScore: aiResult.confidence,
      };
    } catch (error) {
      console.warn('[AIRecommendationEngine] AI recommendation pipeline error. Activating fallback:', error);
      return this.fallbackEngine.getNextRecommendation(userId);
    }
  }
}
