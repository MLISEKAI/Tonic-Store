import React, { useEffect, useState } from 'react';
import { ShipperService } from '../../services/shipper/shipperService';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ShipperDashboardPage: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  // Nếu đang loading auth, show loading
  if (authLoading) return <div>Đang kiểm tra đăng nhập...</div>;
  // Nếu chưa đăng nhập hoặc không phải shipper, redirect về trang chủ
  if (!isAuthenticated || user?.role !== 'DELIVERY') return <Navigate to="/" />;

  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    shipping: 0,
    failed: 0,
    cod: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Lấy tất cả đơn hàng shipper đã nhận (có thể cần backend hỗ trợ API tổng hợp)
      const response = await ShipperService.getDeliveryHistory(1, 1000);
      const orders = response.orders || [];
      let delivered = 0, shipping = 0, failed = 0, cod = 0;
      orders.forEach((order: any) => {
        if (order.status === 'DELIVERED') delivered++;
        else if (order.status === 'SHIPPED') shipping++;
        else if (order.status === 'FAILED') failed++;
        if (order.payment?.method === 'COD' && order.payment?.status === 'COMPLETED') {
          cod += order.totalPrice;
        }
      });
      setStats({
        total: orders.length,
        delivered,
        shipping,
        failed,
        cod,
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Dashboard Shipper</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 rounded p-6 text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-gray-600 mt-2">Tổng số đơn</div>
          </div>
          <div className="bg-green-100 rounded p-6 text-center">
            <div className="text-3xl font-bold">{stats.delivered}</div>
            <div className="text-gray-600 mt-2">Đã giao thành công</div>
          </div>
          <div className="bg-yellow-100 rounded p-6 text-center">
            <div className="text-3xl font-bold">{stats.shipping}</div>
            <div className="text-gray-600 mt-2">Đang giao</div>
          </div>
          <div className="bg-red-100 rounded p-6 text-center">
            <div className="text-3xl font-bold">{stats.failed}</div>
            <div className="text-gray-600 mt-2">Giao thất bại</div>
          </div>
          <div className="bg-indigo-100 rounded p-6 text-center">
            <div className="text-3xl font-bold">{stats.cod.toLocaleString()}đ</div>
            <div className="text-gray-600 mt-2">Tổng tiền COD đã nhận</div>
          </div>
        </div>
      )}
      <div className="mt-8 text-gray-500 text-sm">Cập nhật: {dayjs().format('HH:mm DD/MM/YYYY')}</div>
    </div>
  );
};

export default ShipperDashboardPage; 