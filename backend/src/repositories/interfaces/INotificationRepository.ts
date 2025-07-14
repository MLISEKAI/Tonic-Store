import { Notification } from '@prisma/client';

export interface INotificationRepository {
  createNotification(userId: number, message: string): Promise<Notification>;
} 