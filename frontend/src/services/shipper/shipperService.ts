import { ENDPOINTS, handleResponse } from '../api';

export const ShipperService = {
  // Lấy danh sách đơn hàng cần giao
  async getDeliveryOrders(page = 1, limit = 10, filters = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const url = `${ENDPOINTS.ORDER.DELIVERY_LIST}?${params.toString()}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        let errorMessage = 'Failed to fetch delivery orders';
        let errorData;
        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {}
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to access delivery orders.');
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(error.message || 'Failed to fetch delivery orders. Please try again later.');
    }
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: number, status: string, note?: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENDPOINTS.SHIPPER.UPDATE_STATUS(orderId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, note })
    });
    // Kiểm tra response là JSON trước khi parse
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = 'Failed to update delivery status';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(page = 1, limit = 10, filters = {}) {
    return this.getDeliveryOrders(page, limit, { ...filters, status: 'DELIVERED' });
  },

  // Lấy lịch sử giao hàng của một đơn hàng
  async getOrderDeliveryLogs(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_LOGS(orderId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Lấy đánh giá shipper của một đơn hàng
  async getShipperRating(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_RATING(orderId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Đánh giá shipper
  async rateShipper(orderId: number, rating: number, comment?: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_RATING(orderId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      }
    );
    return handleResponse(response);
  }
}; 