import { ENDPOINTS, handleResponse } from '../api';

export const WishlistService = {
  // Lấy danh sách sản phẩm yêu thích
  async getWishlist() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.WISHLIST.LIST, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Thêm sản phẩm vào wishlist
  async addToWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.WISHLIST.ADD, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.WISHLIST.REMOVE(productId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Kiểm tra trạng thái sản phẩm trong wishlist
  async checkWishlistStatus(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.WISHLIST.CHECK(productId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 