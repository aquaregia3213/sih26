import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/gameService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class GameController {
  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Ensure initial seed data is populated if empty
      await GameService.seedInitialGameContent();

      const categories = await GameService.getCategories();
      ApiResponse.success(res, 'Game categories retrieved successfully', categories, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await GameService.seedInitialGameContent();

      const filters = {
        category: req.query.category as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        gameType: req.query.gameType as string | undefined,
      };

      const games = await GameService.getGames(filters);
      ApiResponse.success(res, 'Games retrieved successfully', games, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getGameById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new AppError('Game ID or slug is required', 400));
      }

      const game = await GameService.getGameById(id);
      ApiResponse.success(res, 'Game details retrieved successfully', game, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async getGameQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new AppError('Game ID or slug is required', 400));
      }

      // CRITICAL SECURITY GUARANTEE: Only include correct answers if authenticated user is ADMIN
      const isUserAdmin = req.user?.role === 'ADMIN';

      const questions = await GameService.getGameQuestions(id, isUserAdmin);
      ApiResponse.success(res, 'Game questions retrieved successfully', questions, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newGame = await GameService.createGame(req.body);
      ApiResponse.success(res, 'Game created successfully', newGame, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedGame = await GameService.updateGame(id, req.body);
      ApiResponse.success(res, 'Game updated successfully', updatedGame, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deactivatedGame = await GameService.deleteGame(id);
      ApiResponse.success(res, 'Game deactivated successfully', deactivatedGame, 200);
    } catch (error) {
      next(error);
    }
  }
}
