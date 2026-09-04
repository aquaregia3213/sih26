import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

// GET /api/health — Reports backend availability and database connectivity
router.get('/', HealthController.getHealth);

export default router;
