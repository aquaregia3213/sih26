import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';

export function validateRegisterInput(req: Request, res: Response, next: NextFunction): void {
  const { email, phone, password, fullName, role } = req.body || {};

  if (!email && !phone) {
    return next(new AppError('Either email or phone number is required for registration', 400));
  }

  if (email && typeof email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(new AppError('Invalid email format', 400));
    }
  }

  if (phone && typeof phone === 'string') {
    if (phone.trim().length < 7) {
      return next(new AppError('Invalid phone number length', 400));
    }
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return next(new AppError('Full name is required', 400));
  }

  // Security constraint: Normal users CANNOT register as ADMIN directly
  if (role) {
    const uppercaseRole = String(role).toUpperCase();
    const validRoles = ['ELDER', 'ELDERLY', 'CAREGIVER'];
    if (!validRoles.includes(uppercaseRole)) {
      return next(new AppError('Invalid role specified. Permitted registration roles: ELDERLY, CAREGIVER', 400));
    }
  }

  next();
}

export function validateLoginInput(req: Request, res: Response, next: NextFunction): void {
  const { login, password } = req.body || {};

  if (!login || typeof login !== 'string' || !login.trim()) {
    return next(new AppError('Email or phone number is required to log in', 400));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required', 400));
  }

  next();
}
