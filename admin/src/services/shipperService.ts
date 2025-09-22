const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export const ShipperService = {
  // Lấy danh sách shipper
  async getAllShippers() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/shippers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch shippers');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching shippers:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết shipper
  async getShipperById(id: number) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/shippers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch shipper details');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching shipper details:', error);
      throw error;
    }
  },

  // Gán shipper cho đơn hàng
  async assignShipperToOrder(orderId: number, shipperId: number) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/shippers/orders/${orderId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shipperId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign shipper');
      }
      return response.json();
    } catch (error) {
      console.error('Error assigning shipper:', error);
      throw error;
    }
  },

  // Lấy lịch sử giao hàng của một đơn hàng (admin)
  async getOrderDeliveryLogs(orderId: number) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch delivery logs');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching delivery logs:', error);
      throw error;
    }
  },

  // Lấy đánh giá của người dùng cho đơn hàng (admin)
  async getOrderDeliveryRating(orderId: number) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/orders/${orderId}/delivery/rating`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        // 404 coi như chưa có đánh giá
        if (response.status === 404) return null;
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch delivery rating');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching delivery rating:', error);
      throw error;
    }
  }
}; 