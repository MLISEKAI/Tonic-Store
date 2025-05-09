export const API_URL = import.meta.env.VITE_API_URL;

export const PaymentService = {
  // Tạo URL thanh toán
  async createPaymentUrl(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment URL');
    }

    return response.json();
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
    const response = await fetch(`${API_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to verify payment');
    return response.json();
  },

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(orderId: string, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }

    return response.json();
  }
}; 