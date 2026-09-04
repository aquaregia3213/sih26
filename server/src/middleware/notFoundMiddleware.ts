import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export function notFoundMiddleware(req: Request, res: Response): void {
  ApiResponse.error(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    404
  );
}
