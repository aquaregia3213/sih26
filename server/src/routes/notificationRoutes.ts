import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All notification endpoints require authentication
router.use(authMiddleware);

// Notification Query & Bulk Operation Routes
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/read-all', NotificationController.markAllAsRead);
router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);

// Admin-Only Direct Creation Route
router.post('/admin', NotificationController.adminCreateNotification);

export default router;
