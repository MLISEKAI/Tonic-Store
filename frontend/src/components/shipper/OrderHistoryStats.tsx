import React from 'react';

interface OrderHistoryStatsProps {
  totalOrders: number;
  totalCOD: number;
}

const OrderHistoryStats: React.FC<OrderHistoryStatsProps> = ({ totalOrders, totalCOD }) => {
  return (
    <div className="bg-gray-100 rounded p-4 flex gap-8 mb-4">
      <div>
        <div className="text-lg font-bold">{totalOrders}</div>
        <div className="text-gray-600">Tổng số đơn đã giao</div>
      </div>
      <div>
        <div className="text-lg font-bold">{totalCOD.toLocaleString()}đ</div>
        <div className="text-gray-600">Tổng tiền COD đã nhận</div>
      </div>
    </div>
  );
};

export default OrderHistoryStats; 