import { ENDPOINTS, handleResponse } from '../api';

export const CartService = {
  // Lấy giỏ hàng
  async getCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CART.GET, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(productId: number, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CART.ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCartItem(itemId: number, quantity: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CART.UPDATE(itemId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(itemId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CART.REMOVE(itemId), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.CART.CLEAR, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  }
}; 