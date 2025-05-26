import { ENDPOINTS, handleResponse } from '../api';

export const OrderService = {
  // Tạo đơn hàng mới
  async createOrder(orderData: {
    items: Array<{
      productId: number;
      quantity: number;
      price: number;
    }>;
    totalPrice: number;
    shippingAddress: string;
    shippingPhone: string;
    shippingName: string;
    note?: string;
    paymentMethod: string;
    userId: number;
  }) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(ENDPOINTS.ORDER.CREATE, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }
    return response.json();
  },

  // Lấy danh sách đơn hàng của user
  async getUserOrders(userId: number, page = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${ENDPOINTS.ORDER.LIST}/user?page=${page}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token.trim()}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy đơn hàng');
        }
        if (response.status === 500) {
          throw new Error('Lỗi server, vui lòng thử lại sau');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user orders');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrder(orderId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(ENDPOINTS.ORDER.DETAIL(orderId), {
      headers: { 
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order');
    }
    return response.json();
  },

  // Hủy đơn hàng
  async cancelOrder(orderId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${ENDPOINTS.ORDER.DETAIL(Number(orderId))}/cancel`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel order');
    }
    return response.json();
  },

  // Lấy cập nhật realtime cho đơn hàng
  getOrderUpdates(orderId: number) {
    const token = localStorage.getItem('token');
    return new EventSource(
      `${ENDPOINTS.ORDER.DETAIL(orderId)}/updates?token=${token}`
    );
  }
}; 