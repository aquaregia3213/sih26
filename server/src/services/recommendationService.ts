import { RecommendationEngine, RecommendationResultDto } from './recommendation/RecommendationEngine';
import { AIRecommendationEngine } from './recommendation/AIRecommendationEngine';

export class RecommendationService {
  private static engine: RecommendationEngine = new AIRecommendationEngine();

  /**
    Allows runtime engine injection (e.g. for testing or future AI Recommendation Engines).
   */
  public static setEngine(customEngine: RecommendationEngine): void {
    RecommendationService.engine = customEngine;
  }

  /**
    Retrieves the current active recommendation engine instance.
   */
  public static getEngine(): RecommendationEngine {
    return RecommendationService.engine;
  }

  /**
    Computes the next activity recommendation for the user using the configured RecommendationEngine.
   */
  public static async getNextRecommendation(userId: string): Promise<RecommendationResultDto | null> {
    return RecommendationService.engine.getNextRecommendation(userId);
  }
}
