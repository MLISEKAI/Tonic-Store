import { ContactMessagePayload, ContactMessageResponse } from '../../types';
import { ENDPOINTS, handleResponse } from '../api';

export const ContactService = {
  // Gửi tin nhắn liên hệ
  async sendMessage(data: ContactMessagePayload): Promise<{ success: boolean; message: string }> {
    const response = await fetch(ENDPOINTS.CONTACT.SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Lấy danh sách tin nhắn (admin only)
  async getMessages(page = 1, limit = 10): Promise<{ messages: ContactMessageResponse[]; total: number }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENDPOINTS.CONTACT.LIST}?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  // Đánh dấu tin nhắn đã đọc
  async markAsRead(messageId: string): Promise<{ success: boolean }> {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CONTACT.MARK_READ(messageId), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  // Xóa tin nhắn
  async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CONTACT.DELETE(messageId), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },
};
