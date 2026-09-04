import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import preferenceRoutes from './preferenceRoutes';
import accessibilityRoutes from './accessibilityRoutes';
import categoryRoutes from './categoryRoutes';
import gameRoutes from './gameRoutes';
import sessionRoutes from './sessionRoutes';
import progressRoutes from './progressRoutes';
import recommendationRoutes from './recommendationRoutes';
import caregiverRoutes from './caregiverRoutes';
import routineRoutes from './routineRoutes';
import notificationRoutes from './notificationRoutes';
import companionRoutes from './companionRoutes';

const router = Router();

// Register sub-routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/accessibility', accessibilityRoutes);
router.use('/categories', categoryRoutes);
router.use('/games', gameRoutes);
router.use('/game-sessions', sessionRoutes);
router.use('/progress', progressRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/caregiver', caregiverRoutes);
router.use('/routines', routineRoutes);
router.use('/notifications', notificationRoutes);
router.use('/companion', companionRoutes);

export default router;

