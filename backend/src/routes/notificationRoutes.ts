import express from 'express';
import { authenticate } from '../middleware/auth';
import { NotificationController } from '../controllers/notificationController';

const router = express.Router();
const notificationController = new NotificationController();

// Get all notifications for the authenticated user
router.get('/', authenticate, notificationController.getNotifications);

// Mark a notification as read
router.put('/:id/read', authenticate, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticate, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Delete all notifications
router.delete('/', authenticate, notificationController.deleteAllNotifications);

export default router; 