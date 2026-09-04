import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET /api/recommendations/next - Authenticated route
router.get('/next', authMiddleware, RecommendationController.getNextRecommendation);

export default router;
