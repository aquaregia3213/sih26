import { Router } from 'express';
import { CaregiverController } from '../controllers/caregiverController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All caregiver endpoints require authentication
router.use(authMiddleware);

// Relationship Connection Lifecycle Routes
router.post('/connections', CaregiverController.createConnection);
router.get('/connections', CaregiverController.listConnections);
router.patch('/connections/:id/accept', CaregiverController.acceptConnection);
router.patch('/connections/:id/reject', CaregiverController.rejectConnection);
router.delete('/connections/:id', CaregiverController.removeConnection);

// Authorized Read-Only Monitoring Routes
router.get('/users/:userId/summary', CaregiverController.getElderlySummary);
router.get('/users/:userId/progress', CaregiverController.getElderlyProgress);
router.get('/users/:userId/activity', CaregiverController.getElderlyActivity);
router.get('/users/:userId/routines', CaregiverController.getElderlyRoutines);

export default router;
