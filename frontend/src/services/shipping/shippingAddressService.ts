export const API_URL = import.meta.env.VITE_API_URL;

export const ShippingAddressService = {
  // Lấy danh sách địa chỉ giao hàng
  async getShippingAddresses() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch shipping addresses');
    return response.json();
  },

  // Lấy chi tiết địa chỉ giao hàng
  async getShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch shipping address');
    return response.json();
  },

  // Tạo địa chỉ giao hàng mới
  async createShippingAddress(data: {
    name: string;
    phone: string;
    address: string;
    isDefault?: boolean;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create shipping address');
    return response.json();
  },

  // Cập nhật địa chỉ giao hàng
  async updateShippingAddress(id: number, data: {
    name?: string;
    phone?: string;
    address?: string;
    isDefault?: boolean;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update shipping address');
    return response.json();
  },

  // Xóa địa chỉ giao hàng
  async deleteShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete shipping address');
    return response.json();
  },

  // Đặt địa chỉ mặc định
  async setDefaultShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/shipping-addresses/${id}/default`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to set default shipping address');
    return response.json();
  }
}; 