import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await api.getCart(token);
      setCart(data);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!token) {
      setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      setLoading(true);
      await api.addToCart(token, product.id, quantity);
      await fetchCart();
    } catch (err) {
      setError('Không thể thêm vào giỏ hàng');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!token) return;
    try {
      setLoading(true);
      await api.removeFromCart(token, productId);
      await fetchCart();
    } catch (err) {
      setError('Không thể xóa sản phẩm');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!token) return;
    try {
      setLoading(true);
      await api.updateCartItem(token, productId, quantity);
      await fetchCart();
    } catch (err) {
      setError('Không thể cập nhật số lượng');
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setCart({ items: [] });
    } catch (err) {
      setError('Không thể xóa giỏ hàng');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 