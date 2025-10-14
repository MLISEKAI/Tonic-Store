import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const ShippingAddressService = {
  // Lấy danh sách địa chỉ giao hàng
  async getShippingAddresses() {
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.ADDRESSES, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy chi tiết địa chỉ giao hàng
  async getShippingAddress(id: number) {
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.UPDATE_ADDRESS(id), {
      headers: getHeaders()
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
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.ADD_ADDRESS, {
      method: 'POST',
      headers: getHeaders(),
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
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.UPDATE_ADDRESS(id), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa địa chỉ giao hàng
  async deleteShippingAddress(id: number) {
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.DELETE_ADDRESS(id), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Đặt địa chỉ mặc định
  async setDefaultShippingAddress(id: number) {
    const response = await fetchWithCredentials(ENDPOINTS.SHIPPING.SET_DEFAULT(id), {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};