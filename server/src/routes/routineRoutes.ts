import { Router } from 'express';
import { RoutineController } from '../controllers/routineController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All routine endpoints require authentication
router.use(authMiddleware);

// Routine Management Routes
router.get('/today', RoutineController.getTodaysRoutines);
router.get('/history', RoutineController.getRoutineHistory);
router.get('/', RoutineController.getUserRoutines);
router.post('/', RoutineController.createRoutine);
router.patch('/:id', RoutineController.updateRoutine);
router.delete('/:id', RoutineController.deleteRoutine);
router.post('/:id/complete', RoutineController.completeRoutine);

export default router;
