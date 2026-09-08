import { Order, OrderDetail, CreateOrderData } from '../types/order';
import { fetchWithCredentials, getHeaders, handleResponse } from './api';

const API_URL = import.meta.env.VITE_API_URL;

const OrderService = {
  // Create new order
  async createOrder(orderData: CreateOrderData) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Get order by ID
  async getOrder(id: string): Promise<OrderDetail> {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get user's orders
  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/user/${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Get all orders (admin)
  async getAllOrders(params: any, _status: string) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithCredentials(`${API_URL}/api/orders?${queryString}`, {
         headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Update order status (admin)
  async updateOrderStatus(id: string, status: string) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/status`, {
       method: 'PATCH',
       headers: getHeaders(),
       body: JSON.stringify({ status })
     });
    return handleResponse(response);
  },

  // Update payment status (admin)
  async updatePaymentStatus(id: string, status: string, transactionId?: string) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/payment`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, transactionId })
    });
    return handleResponse(response);
  },

  // Confirm bank transfer payment (admin)
  async confirmBankTransfer(id: string, transactionId?: string) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/confirm-bank-transfer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ transactionId })
    });
    return handleResponse(response);
  }
};

export default OrderService;
