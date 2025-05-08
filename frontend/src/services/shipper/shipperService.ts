import { API_URL } from '../api';

export const ShipperService = {
  // Lấy danh sách đơn hàng cần giao
  async getDeliveryOrders(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/shipper/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch delivery orders');
    return response.json();
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipper/orders/${orderId}/status`, {
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
  async getDeliveryHistory(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/shipper/history?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch delivery history');
    return response.json();
  }
}; 