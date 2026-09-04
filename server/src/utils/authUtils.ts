import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, UserRole } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email?: string | null;
  phone?: string | null;
  role: UserRole;
}

export type SafeUser = Omit<User, 'passwordHash'>;

/**
  Hashes a plaintext password using bcrypt with a salt factor of 12.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
  Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
  Generates a signed JWT token containing user identity claims.
 */
export function generateToken(payload: JwtPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn } as jwt.SignOptions);
}

/**
  Verifies and decodes a signed JWT token.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

/**
  Strips sensitive fields (e.g., passwordHash) before sending user objects to clients.
 */
export function sanitizeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
