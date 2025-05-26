import { ENDPOINTS, handleResponse } from '../api';

export const ShipperService = {
  // Lấy danh sách đơn hàng cần giao
  async getDeliveryOrders(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_LIST}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: number, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENDPOINTS.ORDER.DELIVERY_STATUS(orderId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_HISTORY}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
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