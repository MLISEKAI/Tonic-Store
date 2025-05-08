import { API_URL } from '../api';

export const CartService = {
  // Lấy giỏ hàng
  async getCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(productId: string, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCartItem(itemId: string, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    return response.json();
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(itemId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to remove cart item');
    return response.json();
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  }
}; 