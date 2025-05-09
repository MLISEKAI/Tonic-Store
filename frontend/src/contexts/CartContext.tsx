import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartService } from '../services/cart/cartService';

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
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await CartService.getCart();
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
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      setLoading(true);
      const result = await CartService.addToCart(product.id, quantity);
      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            ...prevCart,
            items: prevCart.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        } else {
          return {
            ...prevCart,
            items: [...prevCart.items, { id: result.id, product, quantity }]
          };
        }
      });
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
      await CartService.removeFromCart(cartItemId);
      await fetchCart();
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
      await CartService.clearCart();
      setCart({ items: [] });
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
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      loading, 
      error,
      totalItems
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