import { Profile } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorMiddleware';

export class ProfileService {
  /**
    Verifies if requesting user has authorization to access target user's data.
   */
  public static async authorizeUserAccess(
    requestingUserId: string,
    requestingUserRole: string,
    targetUserId: string
  ): Promise<void> {
    if (requestingUserId === targetUserId || requestingUserRole === 'ADMIN') {
      return;
    }

    if (requestingUserRole === 'CAREGIVER') {
      const relationship = await prisma.caregiverRelationship.findFirst({
        where: {
          elderUserId: targetUserId,
          caregiverUserId: requestingUserId,
          status: 'ACTIVE',
        },
      });

      if (relationship && relationship.canViewAnalytics) {
        return;
      }
    }

    throw new AppError('Forbidden: You are not authorized to access or modify this user data', 403);
  }

  /**
    Fetches profile for authenticated user or linked elder.
   */
  public static async getProfile(
    requestingUserId: string,
    requestingUserRole: string,
    targetUserId?: string
  ): Promise<Profile> {
    const effectiveUserId = targetUserId || requestingUserId;
    await this.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    let profile = await prisma.profile.findUnique({
      where: { userId: effectiveUserId },
    });

    // Lazily create profile if missing
    if (!profile) {
      const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
      if (!user) {
        throw new AppError('User account not found', 404);
      }
      profile = await prisma.profile.create({
        data: {
          userId: effectiveUserId,
          fullName: user.email ? user.email.split('@')[0] : 'Vanika User',
        },
      });
    }

    return profile;
  }

  /**
    Updates profile for authenticated user or linked elder.
   */
  public static async updateProfile(
    requestingUserId: string,
    requestingUserRole: string,
    updateDto: Partial<Profile>,
    targetUserId?: string
  ): Promise<Profile> {
    const effectiveUserId = targetUserId || requestingUserId;
    await this.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    // Sanitize protected fields
    const sanitizedData = { ...updateDto };
    delete (sanitizedData as any).id;
    delete (sanitizedData as any).userId;
    delete (sanitizedData as any).user_id;
    delete (sanitizedData as any).createdAt;
    delete (sanitizedData as any).updatedAt;

    // Ensure profile exists
    await this.getProfile(requestingUserId, requestingUserRole, effectiveUserId);

    const updatedProfile = await prisma.profile.update({
      where: { userId: effectiveUserId },
      data: sanitizedData,
    });

    return updatedProfile;
  }
}
