import { Order, OrderDetail, CreateOrderData } from '../types/order';
import { fetchWithCredentials, getHeaders } from './api';

const API_URL = import.meta.env.VITE_API_URL;

const OrderService = {
  // Create new order
  async createOrder(orderData: CreateOrderData) {
    try {
      const response = await fetchWithCredentials(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  async getOrder(id: string): Promise<OrderDetail> {
    try {
      const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
     
      const response = await fetchWithCredentials(`${API_URL}/api/orders/user/${userId}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get all orders (admin)
  async getAllOrders(params: any, _status: string) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetchWithCredentials(`${API_URL}/api/orders?${queryString}`, {
           headers: getHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update order status (admin)
  async updateOrderStatus(id: string, status: string) {
    try {
     const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/status`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update payment status (admin)
  async updatePaymentStatus(id: string, status: string, transactionId?: string) {
    try {
      const response = await fetchWithCredentials(`${API_URL}/api/orders/${id}/payment`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService;
