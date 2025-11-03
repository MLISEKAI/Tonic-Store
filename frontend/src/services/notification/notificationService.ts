import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';
import { Notification } from '../../types';

let cache: Notification[] = [];
let lastFetched = 0;

export const NotificationService = {
  // Lấy danh sách thông báo
  async getNotifications(
    page = 1,
    limit = 10,
    useCache = true
  ): Promise<{ data: Notification[]; total: number }> {
    try {
      const now = Date.now();
      if (useCache && cache.length && now - lastFetched < 30000) {
        return { data: cache, total: cache.length };
      }

      const response = await fetchWithCredentials(
        `${ENDPOINTS.NOTIFICATION.LIST}?page=${page}&limit=${limit}`,
        { headers: getHeaders() }
      );

      const raw = await handleResponse(response);
      const items: Notification[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
      const total: number = Array.isArray(raw) ? raw.length : (raw?.total ?? items.length);

      cache = items || [];
      lastFetched = now;

      return { data: items, total };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Không thể tải danh sách thông báo. Vui lòng thử lại sau.');
    }
  },

  async performAction(url: string, method: 'PUT' | 'DELETE') {
    try {
      const response = await fetchWithCredentials(url, {
        method,
        headers: getHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error performing ${method} on ${url}:`, error);
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  async markAsRead(id: number) {
    const result = await this.performAction(ENDPOINTS.NOTIFICATION.MARK_READ(id), 'PUT');
    // Cập nhật cache (nếu có)
    cache = cache.map(n => (n.id === id ? { ...n, isRead: true } : n));
    return result;
  },

  // Đánh dấu tất cả thông báo đã đọc
  async markAllAsRead() {
    const result = await this.performAction(ENDPOINTS.NOTIFICATION.MARK_ALL_READ, 'PUT');
    cache = cache.map(n => ({ ...n, isRead: true }));
    return result;
  },

  // Xóa thông báo
  async deleteNotification(id: number) {
    const result = await this.performAction(ENDPOINTS.NOTIFICATION.DELETE(id), 'DELETE');
    cache = cache.filter(n => n.id !== id);
    return result;
  },

  // Xóa tất cả thông báo
  async deleteAllNotifications() {
    const result = await this.performAction(ENDPOINTS.NOTIFICATION.DELETE_ALL, 'DELETE');
    cache = [];
    lastFetched = 0;
    return result;
  }
};
