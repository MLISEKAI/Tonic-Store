import { Order, OrderDetail, CreateOrderData } from '../types/order';
import { fetchWithCredentials, getHeaders } from './api';

const API_URL = import.meta.env.VITE_API_URL;

const OrderService = {
  // Create new order
  async createOrder(orderData: CreateOrderData) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // Get order by ID
  async getOrder(id: string): Promise<OrderDetail> {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // Get user's orders
  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/user/${userId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // Get all orders (admin)
  async getAllOrders(params: any, _status: string) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetchWithCredentials(`${API_URL}/api/orders?${queryString}`, {
         headers: getHeaders()
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // Update order status (admin)
  async updateOrderStatus(id: string, status: string) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/status`, {
       method: 'PATCH',
       headers: getHeaders(),
       body: JSON.stringify({ status })
     });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  },

  // Update payment status (admin)
  async updatePaymentStatus(id: string, status: string, transactionId?: string) {
    const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/payment`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, transactionId })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  }
};

export default OrderService;
