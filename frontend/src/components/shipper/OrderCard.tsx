import React from 'react';
import { formatPrice } from '../../utils/format';
import { OrderStatus } from '../../types';
import dayjs from 'dayjs';
import OrderStatusActions from './OrderStatusActions';

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onConfirmPayment: (orderId: number) => void;
  onShowProofModal: () => void;
  onShowFailedModal: () => void;
  onShowChecklistModal: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onConfirmPayment,
  onShowProofModal,
  onShowFailedModal,
  onShowChecklistModal
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Đơn hàng #{order.id}</h2>
          <p className="text-gray-600">Ngày đặt: {dayjs(order.createdAt).format('DD/MM/YYYY')}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Tổng tiền: {formatPrice(order.totalPrice)}</p>
          <p className="text-gray-600">Trạng thái: {order.status}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sản phẩm:</h3>
        <div className="space-y-2">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
              <div className="ml-4">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-gray-600">{item.quantity} x {formatPrice(item.product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Thông tin giao hàng:</h3>
        <p>Người nhận: {order.shippingName}</p>
        <p>Số điện thoại: {order.shippingPhone}</p>
        <p>Địa chỉ: {order.shippingAddress}</p>
      </div>
      <OrderStatusActions
        order={order}
        onStatusChange={onStatusChange}
        onConfirmPayment={onConfirmPayment}
        onShowProofModal={onShowProofModal}
        onShowFailedModal={onShowFailedModal}
        onShowChecklistModal={onShowChecklistModal}
      />
    </div>
  );
};

export default OrderCard; 