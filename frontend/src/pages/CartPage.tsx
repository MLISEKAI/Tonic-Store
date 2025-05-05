import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

export const CartPage: FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await updateQuantity(cartItemId, quantity);
    } catch (err) {
      console.error('Không thể cập nhật số lượng:', err);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
    } catch (err) {
      console.error('Không thể xóa sản phẩm:', err);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      console.error('Giỏ hàng trống');
      return;
    }

    // Check if shipping information is complete
    if (!user?.address || !user?.phone || !user?.name) {
      console.error('Vui lòng cập nhật Thông tin nhận hàng trong hồ sơ của bạn');
      navigate('/user/profile');
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (!cart.items || cart.items.length === 0) {
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
          {cart.items.map((item) => (
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
