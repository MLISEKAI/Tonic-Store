import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Button, message } from 'antd';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import OrderList from '../components/OrderList';

const { TabPane } = Tabs;

export const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Không thể hủy đơn hàng');
      }
  
      const data = await response.json();
      if (data.success) {
        message.success('Đơn hàng đã được hủy thành công');
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: OrderStatus.CANCELLED } : order
          )
        );
      } else {
        throw new Error(data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error: any) {
      console.error('Error canceling order:', error);
      message.error(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

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

  const filteredOrders = (status?: OrderStatus) =>
    status ? orders.filter((o) => o.status === status) : orders;

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
      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả" key="all">
          <OrderList orders={filteredOrders()} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Chờ thanh toán" key="PENDING">
          <OrderList orders={filteredOrders(OrderStatus.PENDING)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đã xác nhận" key="CONFIRMED">
          <OrderList orders={filteredOrders(OrderStatus.CONFIRMED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đang xử lý" key="PROCESSING">
          <OrderList orders={filteredOrders(OrderStatus.PROCESSING)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Vận chuyển" key="SHIPPED">
          <OrderList orders={filteredOrders(OrderStatus.SHIPPED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Chờ giao hàng" key="DELIVERED">
          <OrderList orders={filteredOrders(OrderStatus.DELIVERED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đã hủy" key="CANCELLED">
          <OrderList orders={filteredOrders(OrderStatus.CANCELLED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Hoàn tiền" key="REFUNDED">
          <OrderList orders={filteredOrders(OrderStatus.REFUNDED)} onCancel={handleCancelOrder} />
        </TabPane>
      </Tabs>
    </div>
  );
};