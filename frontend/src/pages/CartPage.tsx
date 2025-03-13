import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export const CartPage: FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await api.getCart(token!);
      setCartItems(data.items);
    } catch (err) {
      setError('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.updateCartItem(token!, itemId, quantity);
      fetchCart();
    } catch (err) {
      setError('Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.removeFromCart(token!, itemId);
      fetchCart();
    } catch (err) {
      setError('Không thể xóa sản phẩm');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.createOrder(token!);
      navigate('/orders');
    } catch (err) {
      setError('Không thể tạo đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
      
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          Giỏ hàng trống
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-indigo-600 font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.product.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border rounded-l"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border rounded-r"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Tổng cộng:</span>
              <span className="text-xl font-bold text-indigo-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(total)}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
