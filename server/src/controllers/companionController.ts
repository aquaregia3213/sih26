import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/ai/geminiService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class CompanionController {
  /**
    POST /api/companion/chat
    Regional AI Companion Chat handler. Protected by authMiddleware and Rate Limiter.
   */
  public static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const { message, language, emotionState } = req.body || {};

      if (!message || typeof message !== 'string' || !message.trim()) {
        return next(new AppError('Chat message string is required', 400));
      }

      const sanitizedMessage = message.trim().substring(0, 500); // Limit max prompt input size
      const sanitizedLanguage = typeof language === 'string' ? language.trim().substring(0, 50) : 'English';
      const sanitizedEmotion = typeof emotionState === 'string' ? emotionState.trim().substring(0, 50) : 'calm';

      const response = await GeminiService.generateCompanionChat({
        message: sanitizedMessage,
        language: sanitizedLanguage,
        emotionState: sanitizedEmotion,
      });

      ApiResponse.success(res, 'Companion chat reply generated', response, 200);
    } catch (error) {
      next(error);
    }
  }
}
