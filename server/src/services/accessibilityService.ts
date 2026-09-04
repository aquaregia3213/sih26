import { AccessibilitySettings } from '@prisma/client';
import { prisma } from '../config/database';
import { ProfileService } from './profileService';
import { AppError } from '../middleware/errorMiddleware';

export class AccessibilityService {
  /**
    Fetches accessibility settings for authenticated user or linked elder.
   */
  public static async getAccessibilitySettings(
    requestingUserId: string,
    requestingUserRole: string,
    targetUserId?: string
  ): Promise<AccessibilitySettings> {
    const effectiveUserId = targetUserId || requestingUserId;
    await ProfileService.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    let settings = await prisma.accessibilitySettings.findUnique({
      where: { userId: effectiveUserId },
    });

    // Lazily create settings if missing
    if (!settings) {
      const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
      if (!user) {
        throw new AppError('User account not found', 404);
      }
      settings = await prisma.accessibilitySettings.create({
        data: {
          userId: effectiveUserId,
        },
      });
    }

    return settings;
  }

  /**
    Updates accessibility settings for authenticated user or linked elder.
   */
  public static async updateAccessibilitySettings(
    requestingUserId: string,
    requestingUserRole: string,
    updateDto: Partial<AccessibilitySettings>,
    targetUserId?: string
  ): Promise<AccessibilitySettings> {
    const effectiveUserId = targetUserId || requestingUserId;
    await ProfileService.authorizeUserAccess(requestingUserId, requestingUserRole, effectiveUserId);

    // Sanitize protected fields
    const sanitizedData = { ...updateDto };
    delete (sanitizedData as any).id;
    delete (sanitizedData as any).userId;
    delete (sanitizedData as any).user_id;
    delete (sanitizedData as any).createdAt;
    delete (sanitizedData as any).updatedAt;

    // Ensure settings exist
    await this.getAccessibilitySettings(requestingUserId, requestingUserRole, effectiveUserId);

    const updatedSettings = await prisma.accessibilitySettings.update({
      where: { userId: effectiveUserId },
      data: sanitizedData,
    });

    return updatedSettings;
  }
}
