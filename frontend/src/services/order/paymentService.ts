import { API_URL } from '../api';

export const PaymentService = {
  // Tạo thanh toán cho đơn hàng
  async createPayment(orderId: string, paymentMethod: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ paymentMethod })
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  },

  // Lấy thông tin thanh toán
  async getPaymentInfo(orderId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch payment info');
    return response.json();
  },

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/payment/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    return response.json();
  }
}; 