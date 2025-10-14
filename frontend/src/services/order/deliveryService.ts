import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const DeliveryService = {
  // Lấy thông tin giao hàng của đơn hàng
  async getOrderDelivery(orderId: string) {
    const response = await fetchWithCredentials(ENDPOINTS.DELIVERY.INFO(orderId), {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: string, status: string) {
    const response = await fetchWithCredentials(ENDPOINTS.DELIVERY.UPDATE_STATUS(orderId), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(orderId: string) {
    const response = await fetchWithCredentials(ENDPOINTS.DELIVERY.HISTORY(orderId), {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};