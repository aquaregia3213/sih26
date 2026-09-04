import { Request, Response, NextFunction } from 'express';
import { CaregiverService } from '../services/caregiverService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorMiddleware';

export class CaregiverController {
  /**
    POST /api/caregiver/connections
    Caregiver sends a connection request to an elderly user.
   */
  public static async createConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      // Security check: Only CAREGIVER or ADMIN can send connection requests
      if (req.user.role !== 'CAREGIVER' && req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only Caregiver accounts can send connection requests', 403));
      }

      const caregiverUserId = req.user.id;
      const { targetElderIdentifier, relationshipType } = req.body || {};

      const result = await CaregiverService.createConnectionRequest(caregiverUserId, {
        targetElderIdentifier,
        relationshipType,
      });

      ApiResponse.success(res, 'Connection request sent successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
    PATCH /api/caregiver/connections/:id/accept
    Target elderly user accepts a pending caregiver connection request.
   */
  public static async acceptConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const elderUserId = req.user.id;
      const relationshipId = req.params.id;

      const result = await CaregiverService.acceptConnectionRequest(elderUserId, relationshipId);
      ApiResponse.success(res, 'Caregiver connection accepted successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    PATCH /api/caregiver/connections/:id/reject
    Target elderly user rejects a pending caregiver connection request.
   */
  public static async rejectConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const elderUserId = req.user.id;
      const relationshipId = req.params.id;

      const result = await CaregiverService.rejectConnectionRequest(elderUserId, relationshipId);
      ApiResponse.success(res, 'Caregiver connection request rejected successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    DELETE /api/caregiver/connections/:id
    Authorized participant removes/revokes an existing caregiver connection.
   */
  public static async removeConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const userId = req.user.id;
      const relationshipId = req.params.id;

      const result = await CaregiverService.removeConnection(userId, relationshipId);
      ApiResponse.success(res, result.message, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/caregiver/connections
    Lists all caregiver relationships for the authenticated user.
   */
  public static async listConnections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      const connections = await CaregiverService.listConnections(req.user.id, req.user.role);
      ApiResponse.success(res, 'Connections retrieved successfully', connections, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/caregiver/users/:userId/summary
    Caregiver views profile and monitoring summary of an ACCEPTED connected elderly user.
    SECURITY GUARANTEE: Enforces relationship authorization check strictly.
   */
  public static async getElderlySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      if (req.user.role !== 'CAREGIVER' && req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only authorized caregivers can access elderly monitoring data', 403));
      }

      const caregiverUserId = req.user.id;
      const targetElderUserId = req.params.userId;

      const summary = await CaregiverService.getElderlySummaryForCaregiver(caregiverUserId, targetElderUserId);
      ApiResponse.success(res, 'Elderly user monitoring summary retrieved successfully', summary, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/caregiver/users/:userId/progress
    Caregiver views progress and domain performance of an ACCEPTED connected elderly user.
   */
  public static async getElderlyProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      if (req.user.role !== 'CAREGIVER' && req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only authorized caregivers can access elderly progress data', 403));
      }

      const caregiverUserId = req.user.id;
      const targetElderUserId = req.params.userId;

      const progress = await CaregiverService.getElderlyProgressForCaregiver(caregiverUserId, targetElderUserId);
      ApiResponse.success(res, 'Elderly user progress data retrieved successfully', progress, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/caregiver/users/:userId/activity
    Caregiver views activity history of an ACCEPTED connected elderly user.
   */
  public static async getElderlyActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      if (req.user.role !== 'CAREGIVER' && req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only authorized caregivers can access elderly activity logs', 403));
      }

      const caregiverUserId = req.user.id;
      const targetElderUserId = req.params.userId;

      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);

      const activity = await CaregiverService.getElderlyActivityForCaregiver(caregiverUserId, targetElderUserId, page, limit);
      ApiResponse.success(res, 'Elderly user activity logs retrieved successfully', activity, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
    GET /api/caregiver/users/:userId/routines
    Caregiver views read-only routine tasks of an ACCEPTED connected elderly user.
   */
  public static async getElderlyRoutines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError('Unauthenticated request', 401));
      }

      if (req.user.role !== 'CAREGIVER' && req.user.role !== 'ADMIN') {
        return next(new AppError('Forbidden: Only authorized caregivers can access elderly routines', 403));
      }

      const caregiverUserId = req.user.id;
      const targetElderUserId = req.params.userId;
      const dateStr = req.query.date as string | undefined;

      const routines = await CaregiverService.getElderlyRoutinesForCaregiver(caregiverUserId, targetElderUserId, dateStr);
      ApiResponse.success(res, 'Elderly user routines retrieved successfully', routines, 200);
    } catch (error) {
      next(error);
    }
  }
}
