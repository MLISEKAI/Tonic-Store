import { API_URL } from '../api';

export const OrderService = {
  // Tạo đơn hàng mới
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    shippingAddress: string;
    paymentMethod: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  // Lấy danh sách đơn hàng
  async getOrders(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Lấy chi tiết đơn hàng
  async getOrder(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Hủy đơn hàng
  async cancelOrder(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    return response.json();
  }
}; 