import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

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
    try {
    const response = await fetchWithCredentials(ENDPOINTS.ORDER.CREATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
    } catch (error: any) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      throw new Error(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
    }
  },

  // Lấy danh sách đơn hàng của user
   async getUserOrders(page = 1, limit = 10, filters: Record<string, any> = {}) {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...filters,
      });
      const response = await fetchWithCredentials(
        `${ENDPOINTS.ORDER.LIST}/user?${params.toString()}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      return await handleResponse(response);
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Mất kết nối. Kiểm tra Internet và thử lại.');
      }
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      throw new Error(error.message || 'Không thể tải danh sách đơn hàng.');
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrder(orderId: number) {
    try {
      const response = await fetchWithCredentials(ENDPOINTS.ORDER.DETAIL(orderId), {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error: any) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      throw new Error(error.message || 'Không thể lấy chi tiết đơn hàng.');
    }
  },

  // Hủy đơn hàng
  async cancelOrder(orderId: string) {
     try {
      const response = await fetchWithCredentials(
        `${ENDPOINTS.ORDER.DETAIL(Number(orderId))}/cancel`,
        {
          method: 'PUT',
          headers: getHeaders(),
        }
      );
      return await handleResponse(response);
    } catch (error: any) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      throw new Error(error.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.');
    }
  },

  // Lấy cập nhật realtime cho đơn hàng
  getOrderUpdates(orderId: number) {
    const url = `${ENDPOINTS.ORDER.DETAIL(orderId)}/updates`;
    const eventSource = new EventSource(url);

    // Tự động reconnect nếu mất kết nối
    eventSource.onerror = () => {
      console.warn('Mất kết nối SSE. Thử kết nối lại sau 5 giây...');
      eventSource.close();
      setTimeout(() => this.getOrderUpdates(orderId), 5000);
    };

    return eventSource;
  },
};