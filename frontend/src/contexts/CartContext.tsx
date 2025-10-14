import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartService } from '../services/carts/cartService';
import { useCartState } from '../hooks/useCartState';

import { Product } from '../types';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cart,
    setCart,
    loading,
    setLoading,
    error,
    setError,
    totalItems,
    totalPrice,
    clearCart: clearCartState
  } = useCartState();
  
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const data = await CartService.getCart();
      setCart({
        items: data.items?.map(item => ({
          id: item.id,
          product: item.product ?? { id: 0, name: 'Unknown', price: 0, imageUrl: '' },
          quantity: item.quantity,
          price: item.price,
        })) || []
      });
    } catch (err) {
      setError('Không thể tải giỏ hàng');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setCart({
        items: []
      });
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await CartService.addToCart(product.id, quantity);
      await fetchCart();
    } catch (err) {
      setError('Không thể thêm vào giỏ hàng');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      await CartService.removeFromCart(cartItemId);
      setCart(prevCart => ({
        items: prevCart.items ? prevCart.items.filter(item => item.id !== cartItemId) : []
      }));
    } catch (err) {
      setError('Không thể xóa sản phẩm');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      await CartService.updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      setError('Không thể cập nhật số lượng');
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      await CartService.clearCart();
      clearCartState();
    } catch (err) {
      setError('Không thể xóa giỏ hàng');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
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