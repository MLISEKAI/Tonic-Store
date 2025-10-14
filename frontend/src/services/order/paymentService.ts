import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';
import type { PaymentVerifyData } from '../../types/payment';

export const PaymentService = {
  // Tạo URL thanh toán
  async createPaymentUrl(orderId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT.CREATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orderId })
    });
    return handleResponse(response);
  },

  // Xác thực thanh toán
 async verifyPayment(data: PaymentVerifyData) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT.VERIFY, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId: string, status: string) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT.UPDATE_STATUS(orderId), {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  async confirmCODPayment(orderId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT.CONFIRM_COD(orderId), {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // async getPaymentHistory() {
  //   const response = await fetchWithCredentials(ENDPOINTS.PAYMENT.HISTORY, {
  //     headers: getHeaders()
  //   });
  //   return handleResponse(response);
  // }
};
