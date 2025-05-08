const API_URL = import.meta.env.VITE_API_URL;

export const ShipperService = {
  // Lấy danh sách đơn hàng của shipper
  async getShipperOrders(status?: string) {
    const url = status 
      ? `${API_URL}/api/shippers/orders?status=${status}`
      : `${API_URL}/api/shippers/orders`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: number, status: string, note?: string) {
    const response = await fetch(`${API_URL}/api/shippers/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status, note })
    });
    if (!response.ok) throw new Error('Failed to update delivery status');
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