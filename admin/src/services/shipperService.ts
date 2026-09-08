import { fetchWithCredentials, getHeaders, handleResponse } from './api';

const API_URL = import.meta.env.VITE_API_URL;

export const ShipperService = {
  // Lấy danh sách shipper
  async getAllShippers() {
    const response = await fetchWithCredentials(`${API_URL}/api/shippers`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy thông tin chi tiết shipper
  async getShipperById(id: number) {
    const response = await fetchWithCredentials(`${API_URL}/api/shippers/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Gán shipper cho đơn hàng
  async assignShipperToOrder(orderId: number, shipperId: number) {
    const response = await fetchWithCredentials(`${API_URL}/api/shippers/orders/${orderId}/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ shipperId })
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng của một đơn hàng (admin)
  async getOrderDeliveryLogs(orderId: number) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${orderId}/delivery/logs`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy đánh giá của người dùng cho đơn hàng (admin)
  async getOrderDeliveryRating(orderId: number) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${orderId}/delivery/rating`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch delivery rating');
    }
    return handleResponse(response);
  }
};