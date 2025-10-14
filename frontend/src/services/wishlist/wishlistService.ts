import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const WishlistService = {
  // Lấy danh sách sản phẩm yêu thích
  async getWishlist() {
    const response = await fetchWithCredentials(ENDPOINTS.WISHLIST.LIST, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Thêm sản phẩm vào wishlist
  async addToWishlist(productId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.WISHLIST.ADD, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(productId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.WISHLIST.REMOVE(productId), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Kiểm tra trạng thái sản phẩm trong wishlist
  async checkWishlistStatus(productId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.WISHLIST.CHECK(productId), {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};