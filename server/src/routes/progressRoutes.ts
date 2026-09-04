import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateTrendQuery, validatePaginationQuery } from '../validators/progressValidator';

const router = Router();

// Require authentication for all progress & analytics endpoints
router.use(authMiddleware);

// GET /api/progress/summary — Overall progress summary & streak
router.get('/summary', ProgressController.getSummary);

// GET /api/progress/history — Paginated activity history
router.get('/history', validatePaginationQuery, ProgressController.getHistory);

// GET /api/progress/categories — Performance breakdown by category
router.get('/categories', ProgressController.getCategories);

// GET /api/progress/trends — Time-based trends (7d, 30d, 90d)
router.get('/trends', validateTrendQuery, ProgressController.getTrends);

export default router;
