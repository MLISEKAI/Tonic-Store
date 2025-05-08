const API_URL = import.meta.env.VITE_API_URL;

export const ShipperService = {
  // Lấy danh sách shipper
  async getAllShippers() {
    const response = await fetch(`${API_URL}/api/shippers`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch shippers');
    return response.json();
  },

  // Lấy thông tin chi tiết shipper
  async getShipperById(id: number) {
    const response = await fetch(`${API_URL}/api/shippers/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch shipper details');
    return response.json();
  },

  // Gán shipper cho đơn hàng
  async assignShipperToOrder(orderId: number, shipperId: number) {
    const response = await fetch(`${API_URL}/api/shippers/orders/${orderId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ shipperId })
    });
    if (!response.ok) throw new Error('Failed to assign shipper');
    return response.json();
  },

  // Lấy lịch sử giao hàng của đơn hàng
  async getOrderDeliveryLogs(orderId: number) {
    const response = await fetch(`${API_URL}/api/shippers/orders/${orderId}/logs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch delivery logs');
    return response.json();
  }
}; 