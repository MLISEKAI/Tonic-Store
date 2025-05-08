import { API_URL } from '../api';

export const FavoriteService = {
  // Lấy danh sách sản phẩm yêu thích
  async getFavorites(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/favorites?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  // Thêm sản phẩm vào danh sách yêu thích
  async addToFavorites(productId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Failed to add to favorites');
    return response.json();
  },

  // Xóa sản phẩm khỏi danh sách yêu thích
  async removeFromFavorites(productId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to remove from favorites');
    return response.json();
  }
}; 