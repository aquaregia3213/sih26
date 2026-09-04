import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateProfileUpdate } from '../validators/profileValidator';

const router = Router();

// Require authentication on all profile routes
router.use(authMiddleware);

// GET /api/profile — Fetch current user (or authorized elder) profile
router.get('/', ProfileController.getProfile);

// PATCH /api/profile — Update current user (or authorized elder) profile
router.patch('/', validateProfileUpdate, ProfileController.updateProfile);

export default router;
