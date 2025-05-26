import { ENDPOINTS, handleResponse } from '../api';

export const PaymentService = {
  // Tạo URL thanh toán
  async createPaymentUrl(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.PAYMENT.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });
    return handleResponse(response);
  },

  // Xác thực thanh toán
  async verifyPayment(data: {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TmnCode: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_TxnRef: string;
    vnp_SecureHash: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.PAYMENT.VERIFY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.PAYMENT.UPDATE_STATUS(orderId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  async confirmCODPayment(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.PAYMENT.CONFIRM_COD(orderId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 
