import { RelationshipStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorMiddleware';
import { ProgressService } from './progressService';

export interface CreateConnectionDto {
  targetElderIdentifier: string; // Email, phone, or UUID of elderly user
  relationshipType?: string;
}

export interface ConnectionSummaryDto {
  id: string;
  elderUserId: string;
  caregiverUserId: string;
  relationshipType: string;
  status: RelationshipStatus;
  canViewAnalytics: boolean;
  canManageRoutines: boolean;
  canUploadMemories: boolean;
  createdAt: Date;
  updatedAt: Date;
  targetUser?: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    role: string;
  };
}

export class CaregiverService {
  /**
    Verifies that an ACTIVE relationship exists between caregiver and target elderly user.
    STRICT SECURITY GUARANTEE: Returns relationship if active, throws 403 Forbidden if not.
   */
  public static async verifyActiveRelationship(
    caregiverUserId: string,
    targetElderUserId: string
  ): Promise<any> {
    if (!caregiverUserId || !targetElderUserId) {
      throw new AppError('Caregiver ID and Elderly User ID are required', 400);
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetElderUserId);
    if (!isUuid) {
      throw new AppError('Invalid target user UUID format', 400);
    }

    const relationship = await prisma.caregiverRelationship.findFirst({
      where: {
        caregiverUserId,
        elderUserId: targetElderUserId,
        status: 'ACTIVE',
      },
    });

    if (!relationship) {
      throw new AppError(
        'Forbidden: Access denied. Active caregiver relationship required to view elderly data.',
        403
      );
    }

    return relationship;
  }

  /**
    Creates a new caregiver connection request targeting an ELDER user.
   */
  public static async createConnectionRequest(
    caregiverUserId: string,
    dto: CreateConnectionDto
  ): Promise<ConnectionSummaryDto> {
    const { targetElderIdentifier, relationshipType = 'Family Caregiver' } = dto;

    if (!targetElderIdentifier || !targetElderIdentifier.trim()) {
      throw new AppError('Target elderly user identifier (email, phone, or ID) is required', 400);
    }

    const targetSearch = targetElderIdentifier.trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetSearch);

    // Find target elder user by email, phone, or UUID
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: targetSearch },
          { phone: targetSearch },
          ...(isUuid ? [{ id: targetSearch }] : []),
        ],
      },
      include: {
        profile: true,
      },
    });

    if (!targetUser) {
      throw new AppError('Target user account not found', 404);
    }

    // Role check: Target user must be ELDER
    if (targetUser.role !== 'ELDER') {
      throw new AppError('Target account must be an Elderly user account', 400);
    }

    // Identity check: Caregiver cannot connect to themselves
    if (targetUser.id === caregiverUserId) {
      throw new AppError('Caregiver cannot send a connection request to themselves', 400);
    }

    // Check existing relationship
    const existing = await prisma.caregiverRelationship.findUnique({
      where: {
        uq_caregiver_pair: {
          elderUserId: targetUser.id,
          caregiverUserId,
        },
      },
    });

    let relationship;

    if (existing) {
      if (existing.status === 'ACTIVE') {
        throw new AppError('An active caregiver relationship already exists with this user', 409);
      }
      if (existing.status === 'PENDING') {
        throw new AppError('A connection request is already pending for this user', 409);
      }

      // Re-open declined or revoked relationship in PENDING state
      relationship = await prisma.caregiverRelationship.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          relationshipType: relationshipType.trim(),
        },
      });
    } else {
      relationship = await prisma.caregiverRelationship.create({
        data: {
          caregiverUserId,
          elderUserId: targetUser.id,
          relationshipType: relationshipType.trim(),
          status: 'PENDING',
        },
      });
    }

    return {
      id: relationship.id,
      elderUserId: relationship.elderUserId,
      caregiverUserId: relationship.caregiverUserId,
      relationshipType: relationship.relationshipType,
      status: relationship.status,
      canViewAnalytics: relationship.canViewAnalytics,
      canManageRoutines: relationship.canManageRoutines,
      canUploadMemories: relationship.canUploadMemories,
      createdAt: relationship.createdAt,
      updatedAt: relationship.updatedAt,
      targetUser: {
        id: targetUser.id,
        fullName: targetUser.profile?.fullName || 'Elderly User',
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
      },
    };
  }

  /**
    Accepts a pending connection request. Can ONLY be invoked by the target ELDER user.
   */
  public static async acceptConnectionRequest(
    elderUserId: string,
    relationshipId: string
  ): Promise<ConnectionSummaryDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(relationshipId);
    if (!isUuid) {
      throw new AppError('Invalid relationship ID format', 400);
    }

    const relationship = await prisma.caregiverRelationship.findUnique({
      where: { id: relationshipId },
      include: {
        caregiverUser: {
          include: { profile: true },
        },
      },
    });

    if (!relationship) {
      throw new AppError('Caregiver connection request not found', 404);
    }

    // Ownership check: Only intended elder user can accept
    if (relationship.elderUserId !== elderUserId) {
      throw new AppError('Forbidden: You are not authorized to accept this connection request', 403);
    }

    // State check
    if (relationship.status === 'ACTIVE') {
      return {
        id: relationship.id,
        elderUserId: relationship.elderUserId,
        caregiverUserId: relationship.caregiverUserId,
        relationshipType: relationship.relationshipType,
        status: relationship.status,
        canViewAnalytics: relationship.canViewAnalytics,
        canManageRoutines: relationship.canManageRoutines,
        canUploadMemories: relationship.canUploadMemories,
        createdAt: relationship.createdAt,
        updatedAt: relationship.updatedAt,
      };
    }

    if (relationship.status !== 'PENDING') {
      throw new AppError(`Cannot accept connection request with status '${relationship.status}'`, 400);
    }

    // Transactional state update
    const updated = await prisma.caregiverRelationship.update({
      where: { id: relationshipId },
      data: { status: 'ACTIVE' },
    });

    return {
      id: updated.id,
      elderUserId: updated.elderUserId,
      caregiverUserId: updated.caregiverUserId,
      relationshipType: updated.relationshipType,
      status: updated.status,
      canViewAnalytics: updated.canViewAnalytics,
      canManageRoutines: updated.canManageRoutines,
      canUploadMemories: updated.canUploadMemories,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
    Rejects a pending connection request. Can ONLY be invoked by the target ELDER user.
   */
  public static async rejectConnectionRequest(
    elderUserId: string,
    relationshipId: string
  ): Promise<ConnectionSummaryDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(relationshipId);
    if (!isUuid) {
      throw new AppError('Invalid relationship ID format', 400);
    }

    const relationship = await prisma.caregiverRelationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      throw new AppError('Caregiver connection request not found', 404);
    }

    // Ownership check: Only intended elder user can reject
    if (relationship.elderUserId !== elderUserId) {
      throw new AppError('Forbidden: You are not authorized to reject this connection request', 403);
    }

    if (relationship.status !== 'PENDING') {
      throw new AppError(`Cannot reject connection request with status '${relationship.status}'`, 400);
    }

    const updated = await prisma.caregiverRelationship.update({
      where: { id: relationshipId },
      data: { status: 'DECLINED' },
    });

    return {
      id: updated.id,
      elderUserId: updated.elderUserId,
      caregiverUserId: updated.caregiverUserId,
      relationshipType: updated.relationshipType,
      status: updated.status,
      canViewAnalytics: updated.canViewAnalytics,
      canManageRoutines: updated.canManageRoutines,
      canUploadMemories: updated.canUploadMemories,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
    Removes an existing connection (revokes relationship). Callable by either participant.
   */
  public static async removeConnection(
    userId: string,
    relationshipId: string
  ): Promise<{ message: string; relationshipId: string }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(relationshipId);
    if (!isUuid) {
      throw new AppError('Invalid relationship ID format', 400);
    }

    const relationship = await prisma.caregiverRelationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      throw new AppError('Caregiver relationship not found', 404);
    }

    // Authorized participant check
    if (relationship.caregiverUserId !== userId && relationship.elderUserId !== userId) {
      throw new AppError('Forbidden: You are not an authorized participant in this relationship', 403);
    }

    // Update status to REVOKED
    await prisma.caregiverRelationship.update({
      where: { id: relationshipId },
      data: { status: 'REVOKED' },
    });

    return {
      message: 'Caregiver relationship successfully removed and access revoked.',
      relationshipId,
    };
  }

  /**
    Lists all caregiver relationships for the authenticated user.
   */
  public static async listConnections(userId: string, userRole: string): Promise<ConnectionSummaryDto[]> {
    const isCaregiver = userRole === 'CAREGIVER' || userRole === 'ADMIN';

    const relationships = await prisma.caregiverRelationship.findMany({
      where: isCaregiver
        ? { caregiverUserId: userId }
        : { elderUserId: userId },
      include: {
        elderUser: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            profile: {
              select: { fullName: true, location: true },
            },
          },
        },
        caregiverUser: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            profile: {
              select: { fullName: true, location: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return relationships.map((rel) => {
      const target = isCaregiver ? rel.elderUser : rel.caregiverUser;
      return {
        id: rel.id,
        elderUserId: rel.elderUserId,
        caregiverUserId: rel.caregiverUserId,
        relationshipType: rel.relationshipType,
        status: rel.status,
        canViewAnalytics: rel.canViewAnalytics,
        canManageRoutines: rel.canManageRoutines,
        canUploadMemories: rel.canUploadMemories,
        createdAt: rel.createdAt,
        updatedAt: rel.updatedAt,
        targetUser: {
          id: target.id,
          fullName: target.profile?.fullName || 'User',
          email: target.email,
          phone: target.phone,
          role: target.role,
        },
      };
    });
  }

  /**
    Caregiver monitoring: Retrieves profile & progress summary for a connected elderly user.
    Enforces ACTIVE relationship check strictly.
   */
  public static async getElderlySummaryForCaregiver(
    caregiverUserId: string,
    targetElderUserId: string
  ): Promise<any> {
    await this.verifyActiveRelationship(caregiverUserId, targetElderUserId);

    const elderUser = await prisma.user.findUnique({
      where: { id: targetElderUserId },
      include: {
        profile: {
          select: {
            fullName: true,
            nickname: true,
            primaryLanguage: true,
            location: true,
            onboardingCompleted: true,
          },
        },
      },
    });

    if (!elderUser) {
      throw new AppError('Elderly user profile not found', 404);
    }

    const progressSummary = await ProgressService.getProgressSummary(targetElderUserId);

    return {
      elderlyUser: {
        id: elderUser.id,
        fullName: elderUser.profile?.fullName || 'Elderly User',
        nickname: elderUser.profile?.nickname || null,
        primaryLanguage: elderUser.profile?.primaryLanguage || 'ENGLISH',
        location: elderUser.profile?.location || null,
      },
      monitoringSummary: {
        totalActivitiesCompleted: progressSummary.totalCompletedSessions,
        averageAccuracy: progressSummary.averageAccuracy,
        averageScore: progressSummary.averageScore,
        currentStreak: progressSummary.currentStreak,
        longestStreak: progressSummary.longestStreak,
        latestCompletedSession: progressSummary.latestCompletedSession,
        recentActivityCount: progressSummary.recentActivity?.length || 0,
      },
      privacyNote: 'Monitoring data is non-diagnostic and descriptive of daily activity engagement.',
    };
  }

  /**
    Caregiver monitoring: Retrieves category performance & progress metrics for a connected elderly user.
    Enforces ACTIVE relationship check strictly.
   */
  public static async getElderlyProgressForCaregiver(
    caregiverUserId: string,
    targetElderUserId: string
  ): Promise<any> {
    await this.verifyActiveRelationship(caregiverUserId, targetElderUserId);

    const progressSummary = await ProgressService.getProgressSummary(targetElderUserId);
    const categoryPerformance = await ProgressService.getCategoryPerformance(targetElderUserId);

    return {
      elderUserId: targetElderUserId,
      totalCompletedSessions: progressSummary.totalCompletedSessions,
      averageAccuracy: progressSummary.averageAccuracy,
      averageScore: progressSummary.averageScore,
      currentStreak: progressSummary.currentStreak,
      longestStreak: progressSummary.longestStreak,
      categoryPerformance,
    };
  }

  /**
    Caregiver monitoring: Retrieves paginated activity history for a connected elderly user.
    Enforces ACTIVE relationship check strictly.
   */
  public static async getElderlyActivityForCaregiver(
    caregiverUserId: string,
    targetElderUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    await this.verifyActiveRelationship(caregiverUserId, targetElderUserId);

    return ProgressService.getActivityHistory(targetElderUserId, page, limit);
  }

  /**
    Caregiver monitoring: Retrieves read-only routines for a connected elderly user.
    Enforces ACTIVE relationship check strictly.
   */
  public static async getElderlyRoutinesForCaregiver(
    caregiverUserId: string,
    targetElderUserId: string,
    dateStr?: string
  ): Promise<any> {
    await this.verifyActiveRelationship(caregiverUserId, targetElderUserId);

    const { RoutineService } = await import('./routineService');
    return RoutineService.getTodaysRoutines(targetElderUserId, dateStr);
  }
}
