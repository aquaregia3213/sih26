import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorMiddleware';

const VALID_PERIODS = ['7d', '30d', '90d'];

export function validateTrendQuery(req: Request, res: Response, next: NextFunction): void {
  const { period } = req.query;

  if (period && typeof period === 'string') {
    if (!VALID_PERIODS.includes(period.toLowerCase())) {
      return next(
        new AppError(`Invalid period parameter. Supported values: ${VALID_PERIODS.join(', ')}`, 400)
      );
    }
  }

  next();
}

export function validatePaginationQuery(req: Request, res: Response, next: NextFunction): void {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page as string, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new AppError('page query parameter must be a positive integer', 400));
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return next(new AppError('limit query parameter must be between 1 and 100', 400));
    }
  }

  next();
}
