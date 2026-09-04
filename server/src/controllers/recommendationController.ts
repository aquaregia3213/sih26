import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendationService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class RecommendationController {
  /**
    GET /api/recommendations/next
    Retrieves the next adaptive game recommendation for the authenticated user.
    SECURITY GUARANTEE: Uses req.user.id strictly from auth middleware; ignores any forged query/body userId.
   */
  public static async getNextRecommendation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      // Security: IDOR protection - strictly use authenticated identity
      const authenticatedUserId = req.user.id;

      const recommendation = await RecommendationService.getNextRecommendation(authenticatedUserId);

      if (!recommendation) {
        ApiResponse.success(
          res,
          'No active playable recommendations available at this time',
          null,
          200
        );
        return;
      }

      ApiResponse.success(
        res,
        'Next personalized activity recommendation retrieved successfully',
        recommendation,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
