import { Router } from 'express';
import { AccessibilityController } from '../controllers/accessibilityController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateAccessibilityUpdate } from '../validators/accessibilityValidator';

const router = Router();

// Require authentication on all accessibility routes
router.use(authMiddleware);

// GET /api/accessibility — Fetch current user (or authorized elder) accessibility settings
router.get('/', AccessibilityController.getAccessibilitySettings);

// PATCH /api/accessibility — Update current user (or authorized elder) accessibility settings
router.patch('/', validateAccessibilityUpdate, AccessibilityController.updateAccessibilitySettings);

export default router;
