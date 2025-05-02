const API_URL = import.meta.env.VITE_API_URL;

const OrderService = {
  // Create new order
  async createOrder(orderData: any) {
    try {
      const response = await fetch(`${API_URL}/user/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  async getOrder(id: string) {
    try {
      const response = await fetch(`${API_URL}/user/orders/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const response = await fetch(`${API_URL}/user/orders/user/${userId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get all orders (admin)
  async getAllOrders(params: any) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/user/orders?${queryString}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update order status (admin)
  async updateOrderStatus(id: string, status: string) {
    try {
      const response = await fetch(`${API_URL}/user/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
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
      const response = await fetch(`${API_URL}/user/orders/${id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, transactionId }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService; 