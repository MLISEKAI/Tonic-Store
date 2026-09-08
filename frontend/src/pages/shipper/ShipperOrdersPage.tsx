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
import { Typography, Spin, Button, Result } from 'antd';
import { ReloadOutlined, ShoppingOutlined } from '@ant-design/icons';

interface Order {
  id: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  createdAt: string;
  items: Array<{
    product: { name: string; price: number; imageUrl: string };
    quantity: number;
  }>;
  payment?: { method: string; status: string };
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

  useEffect(() => { setCurrentPage(1); }, [selectedStatus, searchName, dateRange, paymentMethod]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'DELIVERY') {
      loadOrders();
    } else {
      setError('Vui lòng đăng nhập với vai trò nhân viên giao hàng');
      setLoading(false);
    }
  }, [selectedStatus, searchName, dateRange, paymentMethod, currentPage, pageSize, isAuthenticated, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) throw new Error('User ID not found');
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
    }
  };

  const handleConfirmReceivedPayment = async (orderId: number) => {
    try {
      await PaymentService.confirmCODPayment(orderId);
      await loadOrders();
    } catch (err: any) {
      console.error('Error confirming payment:', err);
    }
  };

  if (!isAuthenticated || user?.role !== 'DELIVERY') {
    return (
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle="Vui lòng đăng nhập với vai trò nhân viên giao hàng"
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            <ShoppingOutlined style={{ marginRight: 8 }} />
            Đơn hàng đang giao
          </Typography.Title>
          <Typography.Text style={{ color: '#6b7280' }}>
            Quản lý các đơn hàng được giao cho bạn
          </Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={loadOrders}>
          Làm mới
        </Button>
      </div>

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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      ) : error ? (
        <Result
          status="error"
          title="Lỗi tải dữ liệu"
          subTitle={error}
          extra={<Button type="primary" onClick={loadOrders}>Thử lại</Button>}
        />
      ) : orders.length === 0 ? (
        <Result
          icon={<ShoppingOutlined />}
          title="Không có đơn hàng"
          subTitle="Không tìm thấy đơn hàng nào phù hợp với bộ lọc"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
      )}

      <PaymentProofModal visible={showProofModal} order={selectedOrder} onClose={() => setShowProofModal(false)} onSuccess={loadOrders} />
      <FailedDeliveryModal visible={showFailedModal} order={selectedOrder} onClose={() => setShowFailedModal(false)} onSuccess={loadOrders} />
      <DeliveryChecklistModal visible={showChecklistModal} order={selectedOrder} onClose={() => setShowChecklistModal(false)} onSuccess={loadOrders} />
    </div>
  );
};

export default ShipperOrders;
