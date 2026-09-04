import { Request, Response, NextFunction } from 'express';
import { DifficultyLevel } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';

const VALID_DIFFICULTIES = Object.values(DifficultyLevel);

export function validateCreateSession(req: Request, res: Response, next: NextFunction): void {
  const { gameId, gameSlug, difficulty } = req.body || {};

  if (!gameId && !gameSlug) {
    return next(new AppError('gameId or gameSlug is required to start a session', 400));
  }

  if (difficulty && typeof difficulty === 'string') {
    if (!VALID_DIFFICULTIES.includes(difficulty.toUpperCase() as DifficultyLevel)) {
      return next(new AppError(`Invalid difficulty specified. Permitted: ${VALID_DIFFICULTIES.join(', ')}`, 400));
    }
  }

  next();
}

export function validateSubmitAnswer(req: Request, res: Response, next: NextFunction): void {
  const { contentItemId } = req.body || {};

  if (!contentItemId || typeof contentItemId !== 'string') {
    return next(new AppError('contentItemId is required for answer submission', 400));
  }

  // Security Protection: Remove client-supplied answers/scores from body
  if ('isCorrect' in req.body) {
    delete req.body.isCorrect;
  }
  if ('score' in req.body) {
    delete req.body.score;
  }
  if ('points' in req.body) {
    delete req.body.points;
  }

  next();
}
