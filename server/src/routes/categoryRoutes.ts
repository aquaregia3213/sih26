import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Require authentication for fetching categories
router.use(authMiddleware);

// GET /api/categories — Retrieve all game categories
router.get('/', GameController.getCategories);

export default router;
