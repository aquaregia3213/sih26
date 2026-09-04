import { Request, Response, NextFunction } from 'express';
import { FontScale, VoicePace } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';

const PROTECTED_FIELDS = ['id', 'userId', 'user_id', 'createdAt', 'updatedAt'];
const VALID_FONT_SCALES = Object.values(FontScale);
const VALID_VOICE_PACES = Object.values(VoicePace);

export function validateAccessibilityUpdate(req: Request, res: Response, next: NextFunction): void {
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

  // Validate fontSize
  if (body.fontSize && !VALID_FONT_SCALES.includes(body.fontSize as FontScale)) {
    return next(
      new AppError(
        `Invalid fontSize specified. Permitted values: ${VALID_FONT_SCALES.join(', ')}`,
        400
      )
    );
  }

  // Validate voiceSpeed
  if (body.voiceSpeed && !VALID_VOICE_PACES.includes(body.voiceSpeed as VoicePace)) {
    return next(
      new AppError(
        `Invalid voiceSpeed specified. Permitted values: ${VALID_VOICE_PACES.join(', ')}`,
        400
      )
    );
  }

  // Validate boolean flags
  const booleanFlags = ['highContrast', 'darkMode', 'reducedMotion', 'voiceGuideEnabled'];
  for (const flag of booleanFlags) {
    if (body[flag] !== undefined && typeof body[flag] !== 'boolean') {
      return next(new AppError(`${flag} must be a boolean (true or false)`, 400));
    }
  }

  next();
}
