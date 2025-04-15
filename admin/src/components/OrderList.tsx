import React, { useState, useEffect } from 'react';
import OrderService from '../services/order.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getAllOrders({ page, status });
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: string, transactionId?: string) => {
    try {
      await OrderService.updatePaymentStatus(orderId, newStatus, transactionId);
      fetchOrders();
    } catch (err) {
      setError('Failed to update payment status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="SHIPPED">Đã giao hàng</option>
          <option value="DELIVERED">Đã nhận hàng</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Khách hàng</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Tổng tiền</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Trạng thái</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Thanh toán</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Ngày tạo</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 border-b border-gray-200">{order.id}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.user.name}
                  <br />
                  <span className="text-sm text-gray-500">{order.user.email}</span>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.totalPrice)}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="SHIPPED">Đã giao hàng</option>
                    <option value="DELIVERED">Đã nhận hàng</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <select
                    value={order.payment?.status || 'PENDING'}
                    onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="COMPLETED">Đã thanh toán</option>
                    <option value="FAILED">Thanh toán thất bại</option>
                    <option value="REFUNDED">Đã hoàn tiền</option>
                  </select>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => window.location.href = `/orders/${order.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`mx-1 px-3 py-1 rounded ${
              page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderList; 