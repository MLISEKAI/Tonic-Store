import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const FavoriteService = {
  // Lấy danh sách sản phẩm yêu thích
  async getFavorites(page = 1, limit = 10) {
    const response = await fetchWithCredentials(
      `${ENDPOINTS.FAVORITE.LIST}?page=${page}&limit=${limit}`,
      {
        headers: getHeaders()
      }
    );
    return handleResponse(response);
  },

  // Thêm sản phẩm vào danh sách yêu thích
  async addToFavorites(productId: string) {
    const response = await fetchWithCredentials(ENDPOINTS.FAVORITE.ADD, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi danh sách yêu thích
  async removeFromFavorites(productId: string) {
    const response = await fetchWithCredentials(ENDPOINTS.FAVORITE.REMOVE(productId), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};