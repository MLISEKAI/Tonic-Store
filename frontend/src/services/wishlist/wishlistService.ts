import { ENDPOINTS, handleResponse } from '../api';

export const WishlistService = {
  // Lấy danh sách sản phẩm yêu thích
  async getWishlist() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(ENDPOINTS.WISHLIST.LIST, {
      headers
    });
    return handleResponse(response);
  },

  // Thêm sản phẩm vào wishlist
  async addToWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(ENDPOINTS.WISHLIST.ADD, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(ENDPOINTS.WISHLIST.REMOVE(productId), {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  // Kiểm tra trạng thái sản phẩm trong wishlist
  async checkWishlistStatus(productId: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(ENDPOINTS.WISHLIST.CHECK(productId), {
      headers
    });
    return handleResponse(response);
  }
}; 