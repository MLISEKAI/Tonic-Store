import { ENDPOINTS, handleResponse } from '../api';

export const FavoriteService = {
  // Lấy danh sách sản phẩm yêu thích
  async getFavorites(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.FAVORITE.LIST}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Thêm sản phẩm vào danh sách yêu thích
  async addToFavorites(productId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.FAVORITE.ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi danh sách yêu thích
  async removeFromFavorites(productId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.FAVORITE.REMOVE(productId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 