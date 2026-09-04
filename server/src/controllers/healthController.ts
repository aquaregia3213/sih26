import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/healthService';
import { ApiResponse } from '../utils/apiResponse';

export class HealthController {
  public static async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const healthData = await HealthService.getHealthStatus();
      const statusCode = healthData.status === 'ok' ? 200 : 503;
      ApiResponse.success(
        res,
        `System status: ${healthData.status}`,
        healthData,
        statusCode
      );
    } catch (error) {
      next(error);
    }
  }
}
