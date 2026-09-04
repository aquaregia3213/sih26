import { DifficultyLevel } from '@prisma/client';

export interface EligibleGameOption {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  baseDifficulty: DifficultyLevel;
}

export interface UserPersonalizationFeatures {
  totalCompletedSessions: number;
  recentAccuracy: number; // 0 - 100
  recentDifficulty: DifficultyLevel;
  recentConsecutiveStrong: number;
  recentConsecutiveWeak: number;
  lastPlayedCategorySlug?: string;
  categoryAccuracies: Array<{
    categorySlug: string;
    gamesCompleted: number;
    accuracy: number;
  }>;
}

export interface AIRecommendationRequest {
  userFeatures: UserPersonalizationFeatures;
  eligibleGames: EligibleGameOption[];
}

export interface RawAIRecommendationOutput {
  recommendedGameId: string;
  recommendedCategory: string;
  recommendedDifficulty: string;
  reason: string;
  confidence: number;
}

export interface CompanionChatInput {
  message: string;
  language?: string;
  emotionState?: string;
}

export interface CompanionChatResponse {
  reply: string;
  source: 'gemini-ai' | 'local-companion' | 'resilient-fallback';
  emotionGuidance: string;
}
