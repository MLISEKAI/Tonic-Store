import { API_URL } from '../config';

export const ShipperService = {
  // Lấy danh sách đơn hàng cần giao
  async getDeliveryOrders(page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/shippers/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch delivery orders');
    return response.json();
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: string, status: string) {
    const response = await fetch(
      `${API_URL}/shippers/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) throw new Error('Failed to update delivery status');
    return response.json();
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/shippers/orders/logs?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch delivery history');
    return response.json();
  },

  // Get order delivery logs
  async getOrderDeliveryLogs(orderId: number) {
    const response = await fetch(
      `${API_URL}/shippers/orders/${orderId}/logs`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch delivery logs');
    }
    return response.json();
  },

  // Get shipper rating for an order
  async getShipperRating(orderId: number) {
    const response = await fetch(
      `${API_URL}/shippers/orders/${orderId}/rating`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch shipper rating');
    }
    return response.json();
  },

  // Rate shipper
  async rateShipper(orderId: number, rating: number, comment?: string) {
    const response = await fetch(
      `${API_URL}/shippers/orders/${orderId}/rating`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to rate shipper');
    }
    return response.json();
  },
}; 