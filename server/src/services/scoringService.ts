import { GameType } from '@prisma/client';

export interface RawAnswerData {
  id: string;
  contentItemId: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface FinalScoringResult {
  scoreObtained: number;
  totalPossibleScore: number;
  accuracyPercentage: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  memoryDomainScore: number;
  attentionDomainScore: number;
  patternDomainScore: number;
  strengthsSummary: string[];
  improvementsSummary: string[];
}

export class ScoringService {
  /**
    Calculates final session score, accuracy, and cognitive domain metrics server-side.
    Formula:
      - Base points per correct question: 100 pts.
      - Speed bonus: +20 pts if response time < 5000ms.
      - Accuracy: (correctCount / totalQuestions) * 100.
      - Domain scores allocated based on gameType (Memory, Attention, Pattern).
   */
  public static calculateSessionScore(
    gameType: GameType,
    totalQuestions: number,
    answers: RawAnswerData[]
  ): FinalScoringResult {
    const total = Math.max(totalQuestions, 1);
    let correctCount = 0;

    answers.forEach((ans) => {
      if (ans.isCorrect) {
        correctCount += 1;
      }
    });

    const incorrectCount = answers.length - correctCount;
    const accuracyPercentage = Math.round(((correctCount / total) * 100) * 100) / 100;

    let scoreObtained = 0;
    const basePerQuestion = 100;

    answers.forEach((ans) => {
      if (ans.isCorrect) {
        scoreObtained += basePerQuestion;
        // Speed bonus for fast correct answers
        if (ans.responseTimeMs > 0 && ans.responseTimeMs < 5000) {
          scoreObtained += 20;
        }
      }
    });

    const totalPossibleScore = total * basePerQuestion;

    // Domain Scores Allocation
    let memoryDomainScore = 0;
    let attentionDomainScore = 0;
    let patternDomainScore = 0;

    const scaledScore = Math.round(accuracyPercentage);

    switch (gameType) {
      case 'PHOTO_RECALL':
      case 'CARD_MATCH':
      case 'SEQUENCE_ORDER':
      case 'HERITAGE_QUIZ':
        memoryDomainScore = scaledScore;
        attentionDomainScore = Math.round(scaledScore * 0.7);
        break;
      case 'SPOT_DIFFERENCE':
        attentionDomainScore = scaledScore;
        patternDomainScore = Math.round(scaledScore * 0.8);
        break;
      case 'PATTERN_COMPLETE':
        patternDomainScore = scaledScore;
        memoryDomainScore = Math.round(scaledScore * 0.7);
        break;
      default:
        memoryDomainScore = scaledScore;
        break;
    }

    // Summaries
    const strengthsSummary: string[] = [];
    const improvementsSummary: string[] = [];

    if (accuracyPercentage >= 80) {
      strengthsSummary.push('High accuracy and strong visual recall');
    } else if (accuracyPercentage >= 50) {
      strengthsSummary.push('Steady engagement and good completion rate');
      improvementsSummary.push('Focus on reducing response latency');
    } else {
      improvementsSummary.push('Recommended daily practice at Easy difficulty');
    }

    return {
      scoreObtained,
      totalPossibleScore,
      accuracyPercentage,
      correctCount,
      incorrectCount,
      totalQuestions: total,
      memoryDomainScore,
      attentionDomainScore,
      patternDomainScore,
      strengthsSummary,
      improvementsSummary,
    };
  }
}
