import { API_URL } from '../api';

export const DeliveryService = {
  // Lấy thông tin giao hàng của đơn hàng
  async getOrderDelivery(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch delivery info');
    return response.json();
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/delivery/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update delivery status');
    return response.json();
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/delivery/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch delivery history');
    return response.json();
  }
}; 