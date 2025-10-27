import type { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationController {
  // Get all notifications for a user
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const notifications = await prisma.notification.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      });

      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Mark a notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const notification = await prisma.notification.update({
        where: {
          id: id,
          userId: userId
        },
        data: {
          isRead: true
        }
      });

      res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      await prisma.notification.updateMany({
        where: {
          userId: userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      });

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete a notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      await prisma.notification.delete({
        where: {
          id: id,
          userId: userId
        }
      });

      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete all notifications
  async deleteAllNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      await prisma.notification.deleteMany({
        where: {
          userId: userId
        }
      });

      res.json({ message: 'All notifications deleted successfully' });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 