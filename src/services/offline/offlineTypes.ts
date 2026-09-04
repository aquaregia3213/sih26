export type NetworkState = 'ONLINE' | 'OFFLINE' | 'RECONNECTING' | 'SYNCING';

export interface CachedGameContent {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  baseDifficulty: string;
  contentItems: Array<{
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }>;
  cachedAt: string;
}

export interface PendingOfflineSession {
  localSessionId: string;
  userId: string;
  gameId: string;
  gameSlug: string;
  difficultyUsed: string;
  scoreObtained: number;
  totalPossibleScore: number;
  accuracyPercentage: number;
  answers: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
  }>;
  completedAt: string;
  status: 'PENDING_SYNC' | 'SYNCED' | 'FAILED_RETRYABLE';
  syncError?: string;
}

export interface SyncResultSummary {
  totalPending: number;
  syncedCount: number;
  failedCount: number;
  timestamp: string;
}
