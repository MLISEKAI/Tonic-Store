import { API_URL } from '../api';

export const ContactService = {
  // Gửi tin nhắn liên hệ
  async sendMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  // Lấy danh sách tin nhắn liên hệ (cho admin)
  async getMessages(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/contact?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to mark message as read');
    return response.json();
  },

  // Xóa tin nhắn
  async deleteMessage(messageId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/contact/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete message');
    return response.json();
  }
}; 