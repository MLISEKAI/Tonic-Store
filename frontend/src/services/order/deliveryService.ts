import { ENDPOINTS, handleResponse } from '../api';

export const DeliveryService = {
  // Lấy thông tin giao hàng của đơn hàng
  async getOrderDelivery(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.DELIVERY.INFO(orderId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.DELIVERY.UPDATE_STATUS(orderId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.DELIVERY.HISTORY(orderId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 