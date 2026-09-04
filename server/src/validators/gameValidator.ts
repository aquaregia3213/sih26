import { Request, Response, NextFunction } from 'express';
import { DifficultyLevel, GameType } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';

const VALID_DIFFICULTIES = Object.values(DifficultyLevel);
const VALID_GAME_TYPES = Object.values(GameType);

export function validateGameQuery(req: Request, res: Response, next: NextFunction): void {
  const { difficulty, gameType } = req.query;

  if (difficulty && typeof difficulty === 'string') {
    if (!VALID_DIFFICULTIES.includes(difficulty.toUpperCase() as DifficultyLevel)) {
      return next(
        new AppError(`Invalid difficulty filter. Valid values: ${VALID_DIFFICULTIES.join(', ')}`, 400)
      );
    }
  }

  if (gameType && typeof gameType === 'string') {
    if (!VALID_GAME_TYPES.includes(gameType.toUpperCase() as GameType)) {
      return next(
        new AppError(`Invalid gameType filter. Valid values: ${VALID_GAME_TYPES.join(', ')}`, 400)
      );
    }
  }

  next();
}

export function validateCreateGame(req: Request, res: Response, next: NextFunction): void {
  const { categoryId, slug, title, description, icon, gameType } = req.body || {};

  if (!categoryId || typeof categoryId !== 'string') {
    return next(new AppError('categoryId is required', 400));
  }

  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return next(new AppError('slug is required', 400));
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    return next(new AppError('title is required', 400));
  }

  if (!description || typeof description !== 'string') {
    return next(new AppError('description is required', 400));
  }

  if (!icon || typeof icon !== 'string') {
    return next(new AppError('icon identifier is required', 400));
  }

  if (!gameType || !VALID_GAME_TYPES.includes(String(gameType).toUpperCase() as GameType)) {
    return next(
      new AppError(`Invalid gameType. Valid types: ${VALID_GAME_TYPES.join(', ')}`, 400)
    );
  }

  next();
}
