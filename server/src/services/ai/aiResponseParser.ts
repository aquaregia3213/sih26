import { DifficultyLevel } from '@prisma/client';
import { EligibleGameOption, RawAIRecommendationOutput } from './aiTypes';

export class AIResponseParser {
  /**
    Safely parses and validates structured JSON output returned by Gemini.
    Returns validated RawAIRecommendationOutput or null if malformed or invalid.
   */
  public static parseRecommendationResponse(
    responseText: string,
    eligibleGames: EligibleGameOption[]
  ): RawAIRecommendationOutput | null {
    if (!responseText || typeof responseText !== 'string') {
      return null;
    }

    try {
      // Clean potential markdown codeblock wrappers
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
      }

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned);

      // Required property presence check
      if (
        !parsed.recommendedGameId ||
        typeof parsed.recommendedGameId !== 'string' ||
        !parsed.recommendedDifficulty ||
        typeof parsed.recommendedDifficulty !== 'string'
      ) {
        return null;
      }

      const difficultyUpper = parsed.recommendedDifficulty.toUpperCase();
      const validDifficulties: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD'];

      if (!validDifficulties.includes(difficultyUpper as DifficultyLevel)) {
        return null;
      }

      // Check if recommendedGameId exists in eligible games list
      const matchedGame = eligibleGames.find(
        (g) => g.id === parsed.recommendedGameId || g.slug === parsed.recommendedGameId
      );

      if (!matchedGame) {
        return null; // Reject non-existent or unapproved game ID recommendations
      }

      const confidenceNum = typeof parsed.confidence === 'number' ? parsed.confidence : 0.85;
      const boundedConfidence = Math.max(0.0, Math.min(1.0, confidenceNum));

      return {
        recommendedGameId: matchedGame.id,
        recommendedCategory: matchedGame.categorySlug,
        recommendedDifficulty: difficultyUpper as DifficultyLevel,
        reason: typeof parsed.reason === 'string' && parsed.reason.trim()
          ? parsed.reason.trim()
          : `Recommended based on your recent activity history.`,
        confidence: boundedConfidence,
      };
    } catch {
      return null;
    }
  }
}
