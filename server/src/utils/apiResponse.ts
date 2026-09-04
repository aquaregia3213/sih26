import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    message: string = 'Operation successful',
    data?: T,
    statusCode: number = 200,
    meta?: any
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  public static error(
    res: Response,
    message: string = 'An unexpected error occurred',
    statusCode: number = 500,
    errorDetails?: any
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      error: errorDetails,
    };
    return res.status(statusCode).json(payload);
  }
}
