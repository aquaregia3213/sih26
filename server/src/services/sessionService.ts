import { GameSession, DifficultyLevel } from '@prisma/client';
import { prisma } from '../config/database';
import { GameService } from './gameService';
import { ScoringService } from './scoringService';
import { AppError } from '../middleware/errorMiddleware';

export interface CreateSessionDto {
  gameId?: string;
  gameSlug?: string;
  difficulty?: DifficultyLevel;
}

export interface SubmitAnswerDto {
  contentItemId: string;
  selectedOptionId?: string;
  voiceInputTranscript?: string;
  responseTimeMs?: number;
}

export class SessionService {
  /**
    Starts a new game session for the authenticated user.
   */
  public static async createSession(
    userId: string,
    dto: CreateSessionDto
  ): Promise<any> {
    const targetGameId = dto.gameId || dto.gameSlug;
    if (!targetGameId) {
      throw new AppError('gameId or gameSlug is required', 400);
    }

    const game = await GameService.getGameById(targetGameId);

    const difficultyUsed = dto.difficulty || game.baseDifficulty || 'EASY';

    const session = await prisma.gameSession.create({
      data: {
        userId,
        gameId: game.id,
        difficultyUsed,
        sessionStatus: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      include: {
        game: {
          select: {
            id: true,
            slug: true,
            title: true,
            gameType: true,
          },
        },
      },
    });

    const questions = await GameService.getGameQuestions(game.id, false);

    return {
      session: {
        id: session.id,
        gameId: session.gameId,
        gameTitle: session.game.title,
        gameSlug: session.game.slug,
        gameType: session.game.gameType,
        difficultyUsed: session.difficultyUsed,
        sessionStatus: session.sessionStatus,
        startedAt: session.startedAt,
      },
      questions,
    };
  }

  /**
    Retrieves a session by ID. Enforces strict user ownership (IDOR protection).
   */
  public static async getSessionById(userId: string, sessionId: string): Promise<any> {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: true,
        submittedAnswers: true,
        gameResult: true,
      },
    });

    if (!session) {
      throw new AppError('Game session not found', 404);
    }

    // Strict IDOR Protection: User can only access their own session
    if (session.userId !== userId) {
      throw new AppError('Forbidden: Access denied to session', 403);
    }

    const questions = await GameService.getGameQuestions(session.gameId, false);

    return {
      session: {
        id: session.id,
        gameId: session.gameId,
        gameTitle: session.game.title,
        gameType: session.game.gameType,
        sessionStatus: session.sessionStatus,
        difficultyUsed: session.difficultyUsed,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        durationSeconds: session.durationSeconds,
        answersSubmittedCount: session.submittedAnswers.length,
      },
      gameResult: session.gameResult,
      questions,
    };
  }

  /**
    Submits an answer for a question in an in-progress session.
    Server-side correctness verification guarantee.
   */
  public static async submitAnswer(
    userId: string,
    sessionId: string,
    dto: SubmitAnswerDto
  ): Promise<any> {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { game: true },
    });

    if (!session) {
      throw new AppError('Game session not found', 404);
    }

    // Strict IDOR Ownership Check
    if (session.userId !== userId) {
      throw new AppError('Forbidden: Access denied to session', 403);
    }

    // Verify session is IN_PROGRESS
    if (session.sessionStatus !== 'IN_PROGRESS') {
      throw new AppError(`Cannot submit answers to a session with status '${session.sessionStatus}'`, 400);
    }

    // Verify content item belongs to game
    const contentItem = await prisma.gameContentItem.findUnique({
      where: { id: dto.contentItemId },
    });

    if (!contentItem || contentItem.gameId !== session.gameId) {
      throw new AppError('The specified content item does not belong to this game session', 400);
    }

    // Prevent duplicate submissions for the same content item in this session
    const existingSubmission = await prisma.submittedAnswer.findFirst({
      where: {
        sessionId,
        contentItemId: dto.contentItemId,
      },
    });

    if (existingSubmission) {
      throw new AppError('An answer for this question has already been submitted in this session', 409);
    }

    let isCorrect = false;
    let explanation: string | null = null;

    if (dto.selectedOptionId) {
      const selectedOption = await prisma.gameOption.findUnique({
        where: { id: dto.selectedOptionId },
      });

      if (!selectedOption || selectedOption.contentItemId !== dto.contentItemId) {
        throw new AppError('The selected answer option does not belong to this question', 400);
      }

      // Read correct answer strictly from DB server-side
      isCorrect = selectedOption.isCorrect;
      explanation = selectedOption.explanation;
    }

    const responseTime = typeof dto.responseTimeMs === 'number' && dto.responseTimeMs > 0 ? dto.responseTimeMs : 1000;

    const submittedRecord = await prisma.submittedAnswer.create({
      data: {
        sessionId,
        contentItemId: dto.contentItemId,
        selectedOptionId: dto.selectedOptionId || null,
        voiceInputTranscript: dto.voiceInputTranscript || null,
        isCorrect,
        responseTimeMs: responseTime,
      },
    });

    return {
      submittedAnswerId: submittedRecord.id,
      sessionId,
      contentItemId: dto.contentItemId,
      isCorrect,
      explanation,
    };
  }

  /**
    Completes a game session and calculates final scores server-side.
   */
  public static async completeSession(userId: string, sessionId: string): Promise<any> {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: true,
        submittedAnswers: true,
        gameResult: true,
      },
    });

    if (!session) {
      throw new AppError('Game session not found', 404);
    }

    // Strict IDOR Ownership Check
    if (session.userId !== userId) {
      throw new AppError('Forbidden: Access denied to session', 403);
    }

    // Prevent double completion
    if (session.sessionStatus === 'COMPLETED') {
      if (session.gameResult) {
        return {
          sessionStatus: session.sessionStatus,
          gameResult: session.gameResult,
        };
      }
      throw new AppError('Session is already completed', 400);
    }

    if (session.sessionStatus !== 'IN_PROGRESS') {
      throw new AppError(`Cannot complete a session with status '${session.sessionStatus}'`, 400);
    }

    // Calculate total questions in game
    const totalQuestions = await prisma.gameContentItem.count({
      where: { gameId: session.gameId },
    });

    const rawAnswers = session.submittedAnswers.map((a) => ({
      id: a.id,
      contentItemId: a.contentItemId,
      isCorrect: a.isCorrect,
      responseTimeMs: a.responseTimeMs,
    }));

    // Server-Side Final Scoring Calculation
    const scoringResult = ScoringService.calculateSessionScore(
      session.game.gameType,
      totalQuestions,
      rawAnswers
    );

    const now = new Date();
    const durationSeconds = Math.max(
      1,
      Math.round((now.getTime() - new Date(session.startedAt).getTime()) / 1000)
    );

    // Atomic transaction: Update session & Create game result
    const result = await prisma.$transaction(async (tx) => {
      await tx.gameSession.update({
        where: { id: sessionId },
        data: {
          sessionStatus: 'COMPLETED',
          completedAt: now,
          durationSeconds,
        },
      });

      const gameResult = await tx.gameResult.create({
        data: {
          sessionId,
          userId,
          gameId: session.gameId,
          scoreObtained: scoringResult.scoreObtained,
          totalPossibleScore: scoringResult.totalPossibleScore,
          accuracyPercentage: scoringResult.accuracyPercentage,
          memoryDomainScore: scoringResult.memoryDomainScore,
          attentionDomainScore: scoringResult.attentionDomainScore,
          patternDomainScore: scoringResult.patternDomainScore,
          strengthsSummary: scoringResult.strengthsSummary,
          improvementsSummary: scoringResult.improvementsSummary,
        },
      });

      return gameResult;
    });

    return {
      sessionId,
      sessionStatus: 'COMPLETED',
      durationSeconds,
      gameResult: result,
    };
  }

  /**
    Retrieves session history for authenticated user.
   */
  public static async getSessionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      prisma.gameSession.findMany({
        where: {
          userId,
          sessionStatus: 'COMPLETED',
        },
        include: {
          game: {
            select: { id: true, slug: true, title: true, icon: true },
          },
          gameResult: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gameSession.count({
        where: {
          userId,
          sessionStatus: 'COMPLETED',
        },
      }),
    ]);

    return {
      history: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
