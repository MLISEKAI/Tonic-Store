import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, notification } from 'antd';
import { Order, OrderStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { OrderService } from '../../services/order/orderService';
import { UserService } from '../../services/user/userService';
import OrderList from '../../components/user/OrderList';

const { TabPane } = Tabs;

export const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleCancelOrder = async (orderId: number) => {
    try {
      await OrderService.cancelOrder(orderId.toString());
      notification.success({
        message: 'Thành công',
        description: 'Đơn hàng đã được hủy thành công',
        placement: 'topRight',
        duration: 2,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: OrderStatus.CANCELLED } : order
        )
      );
    } catch (error: any) {
      console.error('Error canceling order:', error);
      notification.error({
        message: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi hủy đơn hàng',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        if (!user?.id) {
          throw new Error('User ID not found');
        }
        const data = await OrderService.getUserOrders(user.id, 1);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Không thể tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to order status updates
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/orders/updates`);

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.userId === user?.id) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === update.orderId
              ? { ...order, status: update.status }
              : order
          )
        );

        // Show notification based on status
        switch (update.status) {
          case OrderStatus.PROCESSING:
            notification.info({
              message: 'Đơn hàng đang được xử lý',
              description: `Đơn hàng #${update.orderId} đã được gán cho shipper và đang được xử lý.`,
              placement: 'topRight',
              duration: 5,
            });
            break;
          case OrderStatus.SHIPPED:
            notification.info({
              message: 'Đơn hàng đang được giao',
              description: `Đơn hàng #${update.orderId} đang được shipper giao đến bạn.`,
              placement: 'topRight',
              duration: 5,
            });
            break;
          case OrderStatus.DELIVERED:
            notification.success({
              message: 'Đơn hàng đã được giao',
              description: `Đơn hàng #${update.orderId} đã được giao thành công. Vui lòng đánh giá shipper.`,
              placement: 'topRight',
              duration: 5,
            });
            break;
          case OrderStatus.CANCELLED:
            notification.warning({
              message: 'Đơn hàng đã bị hủy',
              description: `Đơn hàng #${update.orderId} đã bị hủy.`,
              placement: 'topRight',
              duration: 5,
            });
            break;
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, navigate, user]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả" key="all">
          <OrderList orders={filteredOrders()} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Chờ xác nhận" key={OrderStatus.PENDING}>
          <OrderList orders={filteredOrders(OrderStatus.PENDING)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đang xử lý" key={OrderStatus.PROCESSING}>
          <OrderList orders={filteredOrders(OrderStatus.PROCESSING)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đang giao hàng" key={OrderStatus.SHIPPED}>
          <OrderList orders={filteredOrders(OrderStatus.SHIPPED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Hoàn thành" key={OrderStatus.DELIVERED}>
          <OrderList orders={filteredOrders(OrderStatus.DELIVERED)} onCancel={handleCancelOrder} />
        </TabPane>
        <TabPane tab="Đã hủy" key={OrderStatus.CANCELLED}>
          <OrderList orders={filteredOrders(OrderStatus.CANCELLED)} onCancel={handleCancelOrder} />
        </TabPane>
      </Tabs>
    </div>
  );
};