import { prisma } from '../prisma';
import { CacheService, CacheKeys } from './cache.service';
import logger from '../config/logger';
import { parsePageOptions, calculatePagination, PaginationMeta } from '../common/types/pagination';

const NOTIFICATION_CACHE_TTL = 300;

const notificationSelect = {
  id: true,
  message: true,
  isRead: true,
  link: true,
  createdAt: true,
};

export const notificationService = {
  async getNotifications(userId: number, query: any): Promise<{ items: any[]; pagination: PaginationMeta }> {
    const pagination = parsePageOptions(query);
    const skip = (pagination.page - 1) * pagination.limit;
    const cacheKey = CacheKeys.NOTIFICATIONS(userId, pagination.page, pagination.limit);

    const cached = await CacheService.get(cacheKey);
    if (cached && typeof cached === 'object' && 'items' in cached) {
      logger.debug('Notification cache HIT', { userId });
      return { items: cached.items, pagination: cached.pagination };
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        select: notificationSelect,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pagination.limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    const paginationMeta = calculatePagination(total, pagination.limit, pagination.page);
    await CacheService.set(cacheKey, { items: notifications, pagination: paginationMeta }, NOTIFICATION_CACHE_TTL);
    return { items: notifications, pagination: paginationMeta };
  },

  async getUnreadCount(userId: number): Promise<number> {
    const cacheKey = CacheKeys.NOTIFICATION_UNREAD_COUNT(userId);
    const cached = await CacheService.get(cacheKey);
    if (cached !== null) {
      return cached as number;
    }

    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    await CacheService.set(cacheKey, count, NOTIFICATION_CACHE_TTL);
    return count;
  },

  async markAsRead(id: string, userId: number) {
    const result = await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
    void CacheService.deletePattern(`notifications:user:${userId}:page:*`);
    void CacheService.delete(CacheKeys.NOTIFICATION_UNREAD_COUNT(userId));
    return result;
  },

  async markAllAsRead(userId: number) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    void CacheService.deletePattern(`notifications:user:${userId}:page:*`);
    void CacheService.delete(CacheKeys.NOTIFICATION_UNREAD_COUNT(userId));
    return result;
  },

  async deleteNotification(id: string, userId: number) {
    const result = await prisma.notification.delete({
      where: { id, userId },
    });
    void CacheService.deletePattern(`notifications:user:${userId}:page:*`);
    void CacheService.delete(CacheKeys.NOTIFICATION_UNREAD_COUNT(userId));
    return result;
  },

  async deleteAllNotifications(userId: number) {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });
    void CacheService.deletePattern(`notifications:user:${userId}:page:*`);
    void CacheService.delete(CacheKeys.NOTIFICATION_UNREAD_COUNT(userId));
    return result;
  },

  async createNotification(userId: number, message: string, link?: string) {
    const result = await prisma.notification.create({
      data: { userId, message, link },
    });
    void CacheService.deletePattern(`notifications:user:${userId}:page:*`);
    void CacheService.delete(CacheKeys.NOTIFICATION_UNREAD_COUNT(userId));
    return result;
  },
};
