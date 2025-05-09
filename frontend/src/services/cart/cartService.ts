export const API_URL = import.meta.env.VITE_API_URL;

export const CartService = {
  // Lấy giỏ hàng
  async getCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(productId: number, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCartItem(itemId: number, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    return response.json();
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(itemId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  }
}; 