import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.getOrders(token!);
        setOrders(data);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có đơn hàng nào
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Đơn hàng #{order.id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Trạng thái: {order.status}
                </p>
              </div>
              
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="px-4 py-4">
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
                            <h4 className="text-lg font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-gray-500">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-indigo-600 font-medium">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-4 py-4 bg-gray-50">
                <div className="flex justify-end">
                  <span className="text-xl font-bold text-indigo-600">
                    Tổng cộng: {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.items.reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
