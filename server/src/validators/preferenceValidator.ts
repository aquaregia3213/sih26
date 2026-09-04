import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorMiddleware';

const PROTECTED_FIELDS = ['id', 'userId', 'user_id', 'createdAt', 'updatedAt'];

export function validatePreferencesUpdate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return next(new AppError('Update payload cannot be empty', 400));
  }

  // Reject protected fields
  const attemptedProtected = PROTECTED_FIELDS.filter((field) => field in body);
  if (attemptedProtected.length > 0) {
    return next(
      new AppError(
        `Security Violation: Modification of protected field(s) '${attemptedProtected.join(', ')}' is strictly prohibited`,
        400,
        { protectedFieldsAttempted: attemptedProtected }
      )
    );
  }

  // Validate dailyActivityGoal
  if (body.dailyActivityGoal !== undefined) {
    const goal = Number(body.dailyActivityGoal);
    if (!Number.isInteger(goal) || goal < 1 || goal > 10) {
      return next(new AppError('dailyActivityGoal must be an integer between 1 and 10', 400));
    }
  }

  // Validate preferredPracticeAreas
  if (body.preferredPracticeAreas !== undefined && !Array.isArray(body.preferredPracticeAreas)) {
    return next(new AppError('preferredPracticeAreas must be an array of string practice domain keys', 400));
  }

  next();
}
