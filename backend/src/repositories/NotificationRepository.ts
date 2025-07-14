import { PrismaClient, Notification } from '@prisma/client';
import { INotificationRepository } from './interfaces/INotificationRepository';

export class NotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async createNotification(userId: number, message: string): Promise<Notification> {
    return this.prisma.notification.create({ data: { userId, message, isRead: false } });
  }
} 