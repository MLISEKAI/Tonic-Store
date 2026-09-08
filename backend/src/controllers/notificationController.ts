import { notificationService } from '../services/notificationService';
import type { Request, Response } from 'express';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }

      const { items, pagination } = await notificationService.getNotifications(userId, req.query);
      res.set('X-Cache', pagination ? '' : '');
      res.apiSuccess(items, "Lấy danh sách thông báo thành công", 200, pagination);
    } catch (error) {
      handleControllerError(res, error, "getNotifications");
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }

      const notification = await notificationService.markAsRead(id, userId);
      res.apiSuccess(notification, "Đánh dấu đã đọc thành công");
    } catch (error) {
      handleControllerError(res, error, "markAsRead");
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }

      await notificationService.markAllAsRead(userId);
      res.apiSuccess(null, "Đánh dấu tất cả đã đọc thành công");
    } catch (error) {
      handleControllerError(res, error, "markAllAsRead");
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }

      await notificationService.deleteNotification(id, userId);
      res.apiSuccess(null, "Xóa thông báo thành công");
    } catch (error) {
      handleControllerError(res, error, "deleteNotification");
    }
  }

  async deleteAllNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }

      await notificationService.deleteAllNotifications(userId);
      res.apiSuccess(null, "Xóa tất cả thông báo thành công");
    } catch (error) {
      handleControllerError(res, error, "deleteAllNotifications");
    }
  }
}
