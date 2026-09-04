import { UserPreferences } from '@prisma/client';
import { prisma } from '../config/database';
import { ProfileService } from './profileService';
import { AppError } from '../middleware/errorMiddleware';

export class PreferenceService {
  /**
    Fetches user preferences for authenticated user or linked elder.
   */
  public static async getPreferences(
    requestingUserId: string,
    requestingUserRole: string,
    targetUserId?: string
  ): Promise<UserPreferences> {
    const effectiveUserId = targetUserId || requestingUserId;
    await ProfileService.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: effectiveUserId },
    });

    // Lazily create preferences if missing
    if (!preferences) {
      const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
      if (!user) {
        throw new AppError('User account not found', 404);
      }
      preferences = await prisma.userPreferences.create({
        data: {
          userId: effectiveUserId,
        },
      });
    }

    return preferences;
  }

  /**
    Updates user preferences for authenticated user or linked elder.
   */
  public static async updatePreferences(
    requestingUserId: string,
    requestingUserRole: string,
    updateDto: Partial<UserPreferences>,
    targetUserId?: string
  ): Promise<UserPreferences> {
    const effectiveUserId = targetUserId || requestingUserId;
    await ProfileService.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    // Sanitize protected fields
    const sanitizedData = { ...updateDto };
    delete (sanitizedData as any).id;
    delete (sanitizedData as any).userId;
    delete (sanitizedData as any).user_id;
    delete (sanitizedData as any).createdAt;
    delete (sanitizedData as any).updatedAt;

    // Ensure preferences exist
    await this.getPreferences(requestingUserId, requestingUserRole, effectiveUserId);

    const updatedPreferences = await prisma.userPreferences.update({
      where: { userId: effectiveUserId },
      data: sanitizedData,
    });

    return updatedPreferences;
  }
}
