export const API_URL = import.meta.env.VITE_API_URL;

export const WishlistService = {
  // Lấy danh sách sản phẩm yêu thích
  async getWishlist() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },

  // Thêm sản phẩm vào wishlist
  async addToWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return response.json();
  },

  // Kiểm tra trạng thái sản phẩm trong wishlist
  async checkWishlistStatus(productId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/wishlist/check/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to check wishlist status');
    return response.json();
  }
}; 