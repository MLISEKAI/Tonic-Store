import React from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusActionsProps {
  order: any;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onConfirmPayment: (orderId: number) => void;
  onShowProofModal: () => void;
  onShowFailedModal: () => void;
  onShowChecklistModal: () => void;
}

const OrderStatusActions: React.FC<OrderStatusActionsProps> = ({
  order,
  onStatusChange,
  onConfirmPayment,
  onShowProofModal,
  onShowFailedModal,
  onShowChecklistModal
}) => {
  return (
    <div className="flex space-x-2">
      {order.status === OrderStatus.PROCESSING && (
        <button onClick={() => onStatusChange(order.id, OrderStatus.SHIPPED)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Bắt đầu giao hàng</button>
      )}
      {order.status === OrderStatus.SHIPPED && (
        <>
          <button onClick={onShowChecklistModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Checklist giao hàng</button>
          <button onClick={onShowProofModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Xác nhận đã giao (ảnh)</button>
          <button onClick={onShowFailedModal} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Không giao được</button>
        </>
      )}
      {order.status === OrderStatus.DELIVERED && order.payment?.method === 'COD' && order.payment?.status === 'PENDING' && (
        <button onClick={() => onConfirmPayment(order.id)} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Xác nhận đã nhận tiền</button>
      )}
    </div>
  );
};

export default OrderStatusActions; 