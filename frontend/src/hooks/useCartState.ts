import { useState, useMemo } from 'react';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

/**
 * Custom hook to manage shopping cart state
 * @returns Object containing cart state and utility functions
 */
export function useCartState() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalItems = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart.items]);

  const clearCart = () => {
    setCart({ items: [] });
    setError(null);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    cart,
    setCart,
    loading,
    setLoading,
    error,
    setError,
    totalItems,
    totalPrice,
    clearCart,
    resetError
  };
} 