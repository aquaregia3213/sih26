import { Router } from 'express';
import { PreferenceController } from '../controllers/preferenceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validatePreferencesUpdate } from '../validators/preferenceValidator';

const router = Router();

// Require authentication on all preference routes
router.use(authMiddleware);

// GET /api/preferences — Fetch current user (or authorized elder) preferences
router.get('/', PreferenceController.getPreferences);

// PATCH /api/preferences — Update current user (or authorized elder) preferences
router.patch('/', validatePreferencesUpdate, PreferenceController.updatePreferences);

export default router;
