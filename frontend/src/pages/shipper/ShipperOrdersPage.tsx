import React, { useEffect, useState } from 'react';
import { ShipperService } from '../../services/shipper/shipperService';
import { OrderStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentService } from '../../services/order/paymentService';
import OrderFilter from '../../components/shipper/OrderFilter';
import OrderCard from '../../components/shipper/OrderCard';
import PaymentProofModal from '../../components/shipper/PaymentProofModal';
import FailedDeliveryModal from '../../components/shipper/FailedDeliveryModal';
import DeliveryChecklistModal from '../../components/shipper/DeliveryChecklistModal';

interface Order {
  id: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      price: number;
      imageUrl: string;
    };
    quantity: number;
  }>;
  payment?: {
    method: string;
    status: string;
  };
}

const ShipperOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchName, setSearchName] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Reset page về 1 khi filter thay đổi
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedStatus, searchName, dateRange, paymentMethod]);

  useEffect(() => {
      if (isAuthenticated && user?.role === 'DELIVERY') {
      loadOrders();
      } else {
        setError('Please login as a delivery staff to view orders');
        setLoading(false);
      }
    // eslint-disable-next-line
  }, [selectedStatus, searchName, dateRange, paymentMethod, currentPage, pageSize, isAuthenticated, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) throw new Error('User ID not found. Please login again.');
      const response = await ShipperService.getDeliveryOrders(currentPage, pageSize, {
        status: selectedStatus,
        name: searchName,
        dateFrom: dateRange ? dateRange[0] : undefined,
        dateTo: dateRange ? dateRange[1] : undefined,
        paymentMethod,
      });
      setOrders(response.orders || []);
      setTotalOrders(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await ShipperService.updateDeliveryStatus(orderId, newStatus);
      await loadOrders();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(err.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleConfirmReceivedPayment = async (orderId: number) => {
    try {
      await PaymentService.confirmCODPayment(orderId);
      await loadOrders();
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      alert(err.message || 'Xác nhận nhận tiền thất bại!');
    }
  };

  if (!isAuthenticated || user?.role !== 'DELIVERY') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
          <p>Vui lòng đăng nhập với vai trò là nhân viên giao hàng để xem đơn hàng</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Lỗi</h2>
          <p>{error}</p>
          <button onClick={loadOrders} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Thử lại</button>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      <OrderFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchName={searchName}
        setSearchName={setSearchName}
        dateRange={dateRange}
        setDateRange={setDateRange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalOrders={totalOrders}
      />
      <div className="space-y-4 mt-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onConfirmPayment={handleConfirmReceivedPayment}
            onShowProofModal={() => { setSelectedOrder(order); setShowProofModal(true); }}
            onShowFailedModal={() => { setSelectedOrder(order); setShowFailedModal(true); }}
            onShowChecklistModal={() => { setSelectedOrder(order); setShowChecklistModal(true); }}
          />
        ))}
      </div>
      <PaymentProofModal
        visible={showProofModal}
        order={selectedOrder}
        onClose={() => setShowProofModal(false)}
        onSuccess={loadOrders}
      />
      <FailedDeliveryModal
        visible={showFailedModal}
        order={selectedOrder}
        onClose={() => setShowFailedModal(false)}
        onSuccess={loadOrders}
      />
      <DeliveryChecklistModal
        visible={showChecklistModal}
        order={selectedOrder}
        onClose={() => setShowChecklistModal(false)}
        onSuccess={loadOrders}
      />
    </div>
  );
};

export default ShipperOrders; 