import { Request, Response, NextFunction } from 'express';
import { AppLanguage } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';

const PROTECTED_FIELDS = ['id', 'userId', 'user_id', 'role', 'passwordHash', 'password_hash', 'createdAt', 'updatedAt', 'isVerified', 'isActive'];

const VALID_LANGUAGES = Object.values(AppLanguage);

export function validateProfileUpdate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return next(new AppError('Update payload cannot be empty', 400));
  }

  // Reject protected fields explicitly if attempted
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

  // Validate primaryLanguage if present
  if (body.primaryLanguage && !VALID_LANGUAGES.includes(body.primaryLanguage as AppLanguage)) {
    return next(
      new AppError(
        `Invalid language specified. Supported languages: ${VALID_LANGUAGES.join(', ')}`,
        400
      )
    );
  }

  // Validate fullName if provided
  if (body.fullName !== undefined && (typeof body.fullName !== 'string' || !body.fullName.trim())) {
    return next(new AppError('Full name must be a non-empty string', 400));
  }

  next();
}
