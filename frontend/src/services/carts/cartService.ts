import { Cart, CartItem } from '../../types';
import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';


let cartCache: Cart | null = null;
let lastFetched = 0;

export const CartService = {
  // Lấy giỏ hàng (có cache)
  async getCart(useCache = true): Promise<Cart> {
    const now = Date.now();

    // Nếu dữ liệu đã được cache trong vòng 30s → dùng lại
    if (useCache && cartCache && now - lastFetched < 30000) {
      return cartCache;
    }

    // Nếu chưa có cache hoặc hết hạn → gọi API
    const response = await fetchWithCredentials(ENDPOINTS.CART.GET, {
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    cartCache = data;
    lastFetched = now;

    return data;
  },

  // Thêm sản phẩm
  async addToCart(productId: number, quantity: number) {
    const response = await fetchWithCredentials(ENDPOINTS.CART.ADD, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await handleResponse(response);

    // Cập nhật lại cache sau khi thêm
    cartCache = data;
    lastFetched = Date.now();

    return data;
  },

  // Cập nhật số lượng sản phẩm
  async updateCartItem(itemId: number, quantity: number) {
    const response = await fetchWithCredentials(ENDPOINTS.CART.UPDATE(itemId), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await handleResponse(response);

    // Cập nhật lại cache
    cartCache = data;
    lastFetched = Date.now();

    return data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(itemId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.CART.REMOVE(itemId), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);

    // Cập nhật lại cache
    cartCache = data;
    lastFetched = Date.now();

    return data;
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart() {
    const response = await fetchWithCredentials(ENDPOINTS.CART.CLEAR, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);

    // Xóa cache luôn
    cartCache = null;
    lastFetched = 0;

    return data;
  },
};
