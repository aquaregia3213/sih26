import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorMiddleware';

/**
  Extensible validation middleware helper for future route payload validation.
 */
export function validateRequestBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) {
      return next(new AppError('Request body is required', 400));
    }

    const missingFields = requiredFields.filter((field) => !(field in req.body));
    if (missingFields.length > 0) {
      return next(
        new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400, {
          missingFields,
        })
      );
    }

    next();
  };
}
