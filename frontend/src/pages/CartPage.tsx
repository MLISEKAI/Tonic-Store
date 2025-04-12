import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
        <p>Giỏ hàng của bạn đang trống</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-4 text-red-500"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Tổng cộng</h2>
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Tổng tiền:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-2 rounded mt-4"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
