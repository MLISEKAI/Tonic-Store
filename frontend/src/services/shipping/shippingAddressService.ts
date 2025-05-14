import { ENDPOINTS, handleResponse } from '../api';

export const ShippingAddressService = {
  // Lấy danh sách địa chỉ giao hàng
  async getShippingAddresses() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.ADDRESSES, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Lấy chi tiết địa chỉ giao hàng
  async getShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.UPDATE_ADDRESS(id), {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Tạo địa chỉ giao hàng mới
  async createShippingAddress(data: {
    name: string;
    phone: string;
    address: string;
    isDefault?: boolean;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.ADD_ADDRESS, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật địa chỉ giao hàng
  async updateShippingAddress(id: number, data: {
    name?: string;
    phone?: string;
    address?: string;
    isDefault?: boolean;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.UPDATE_ADDRESS(id), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa địa chỉ giao hàng
  async deleteShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.DELETE_ADDRESS(id), {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Đặt địa chỉ mặc định
  async setDefaultShippingAddress(id: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SHIPPING.SET_DEFAULT(id), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
}; 