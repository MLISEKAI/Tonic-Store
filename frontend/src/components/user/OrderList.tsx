import { FC } from 'react';
import { Button } from 'antd';
import { Order, OrderStatus } from '../../types';
import { useNavigate } from 'react-router-dom';

interface OrderListProps {
  orders: Order[];
  onCancel: (orderId: number) => void;
}

const OrderList: FC<OrderListProps> = ({ orders, onCancel }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return <div className="text-center text-gray-500">Không có đơn hàng nào</div>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow overflow-hidden sm:rounded-lg cursor-pointer hover:bg-gray-100 transition"
          onClick={() => navigate(`/user/orders/${order.id}`)}
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Đơn hàng #{order.id}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Trạng thái: {order.status}</p>
          </div>
          <div className="px-4 py-4 bg-gray-50" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end gap-2">
              {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PROCESSING) && (
                <Button
                  type="primary"
                  danger
                  onClick={() => onCancel(order.id)}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {(order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) && (
                <Button onClick={() => navigate(`/user/orders/${order.id}`)}>
                  Xem chi tiết
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;