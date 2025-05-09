export const API_URL = import.meta.env.VITE_API_URL;

export const NotificationService = {
  // Lấy danh sách thông báo
  async getNotifications(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  // Đánh dấu thông báo đã đọc
  async markAsRead(notificationId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  },

  // Đánh dấu tất cả thông báo đã đọc
  async markAllAsRead() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
  },

  // Xóa thông báo
  async deleteNotification(notificationId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
  },

  // Xóa tất cả thông báo
  async deleteAllNotifications() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete all notifications');
    return response.json();
  }
}; 