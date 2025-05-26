import { ENDPOINTS, handleResponse } from '../api';

export const NotificationService = {
  // Lấy danh sách thông báo
  async getNotifications(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.NOTIFICATION.LIST}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Đánh dấu thông báo đã đọc
  async markAsRead(notificationId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.NOTIFICATION.MARK_READ(notificationId), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Đánh dấu tất cả thông báo đã đọc
  async markAllAsRead() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.NOTIFICATION.MARK_ALL_READ, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Xóa thông báo
  async deleteNotification(notificationId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.NOTIFICATION.DELETE(notificationId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Xóa tất cả thông báo
  async deleteAllNotifications() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.NOTIFICATION.DELETE_ALL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 