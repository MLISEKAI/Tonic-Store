export const API_URL = import.meta.env.VITE_API_URL;

export const FavoriteService = {
  // Lấy danh sách sản phẩm yêu thích
  async getFavorites() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  // Thêm sản phẩm vào yêu thích
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

  // Xóa sản phẩm khỏi yêu thích
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