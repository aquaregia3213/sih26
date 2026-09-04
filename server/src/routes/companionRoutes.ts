import { Router } from 'express';
import { CompanionController } from '../controllers/companionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { aiRateLimiter } from '../middleware/aiRateLimiter';

const router = Router();

// Companion Chat endpoint protected by authMiddleware and rate limiting
router.post('/chat', authMiddleware, aiRateLimiter, CompanionController.chat);

export default router;
