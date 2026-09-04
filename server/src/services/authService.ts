import { UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword, comparePassword, generateToken, sanitizeUser, SafeUser } from '../utils/authUtils';
import { AppError } from '../middleware/errorMiddleware';

export interface RegisterDto {
  email?: string;
  phone?: string;
  password: string;
  fullName: string;
  role?: string;
  location?: string;
}

export interface LoginDto {
  login: string; // Email or phone
  password: string;
}

export interface AuthResponse {
  user: SafeUser & { profile?: any };
  token: string;
}

export class AuthService {
  /**
    Registers a new user (ELDER/ELDERLY or CAREGIVER) with profile in a Prisma transaction.
   */
  public static async register(dto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email ? dto.email.trim().toLowerCase() : null;
    const normalizedPhone = dto.phone ? dto.phone.trim() : null;

    if (!normalizedEmail && !normalizedPhone) {
      throw new AppError('Either email or phone number is required for registration', 400);
    }

    if (!dto.password || typeof dto.password !== 'string' || dto.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    if (!dto.fullName || typeof dto.fullName !== 'string' || !dto.fullName.trim()) {
      throw new AppError('Full name is required', 400);
    }

    // Check duplicate email
    if (normalizedEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existingEmail) {
        throw new AppError('An account with this email already exists', 409);
      }
    }

    // Check duplicate phone
    if (normalizedPhone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: normalizedPhone },
      });
      if (existingPhone) {
        throw new AppError('An account with this phone number already exists', 409);
      }
    }

    const hashedPassword = await hashPassword(dto.password);

    let assignedRole: UserRole = 'ELDER';
    if (dto.role) {
      const upperRole = dto.role.toUpperCase();
      if (upperRole === 'CAREGIVER') {
        assignedRole = 'CAREGIVER';
      } else if (upperRole === 'ADMIN') {
        assignedRole = 'ADMIN';
      } else if (upperRole === 'ELDER' || upperRole === 'ELDERLY') {
        assignedRole = 'ELDER';
      }
    }

    // Execute atomic creation of User, Profile, AccessibilitySettings, UserPreferences
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          phone: normalizedPhone,
          passwordHash: hashedPassword,
          role: assignedRole,
          isActive: true,
          isVerified: false,
          profile: {
            create: {
              fullName: dto.fullName.trim(),
              location: dto.location || 'Guwahati, Assam',
            },
          },
          accessibilitySettings: {
            create: {},
          },
          userPreferences: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });
      return user;
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    });

    return {
      user: sanitizeUser(newUser),
      token,
    };
  }

  /**
    Authenticates a user by email/phone and password.
   */
  public static async login(dto: LoginDto): Promise<AuthResponse> {
    if (!dto.login || typeof dto.login !== 'string' || !dto.login.trim()) {
      throw new AppError('Email or phone number is required to log in', 400);
    }
    const search = dto.login.trim().toLowerCase();

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: search },
          { phone: search },
        ],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email/phone or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive. Please contact support.', 403);
    }

    const isMatch = await comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email/phone or password', 401);
    }

    // Update lastLoginAt asynchronously
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
    Fetches the authenticated user profile using token user ID. Never trusts client-provided ID.
   */
  public static async getCurrentUser(userId: string): Promise<SafeUser & { profile?: any; accessibilitySettings?: any }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        accessibilitySettings: true,
        userPreferences: true,
      },
    });

    if (!user) {
      throw new AppError('Authenticated user account not found', 404);
    }

    return sanitizeUser(user);
  }
}
