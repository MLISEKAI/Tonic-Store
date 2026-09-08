import React, { useEffect, useState, useRef } from 'react';
import { ShipperService } from '../../services/shipper/shipperService';
import OrderFilter from '../../components/shipper/OrderFilter';
import OrderCard from '../../components/shipper/OrderCard';
import OrderHistoryStats from '../../components/shipper/OrderHistoryStats';
import { Typography, Spin, Result, Button } from 'antd';
import { HistoryOutlined, ReloadOutlined } from '@ant-design/icons';

const ShipperOrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('DELIVERED');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [searchName, setSearchName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalSearch, setInternalSearch] = React.useState(searchName);

  useEffect(() => { setInternalSearch(searchName); }, [searchName]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchName(internalSearch), 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [internalSearch]);

  useEffect(() => { setCurrentPage(1); }, [selectedStatus, searchName, dateRange, paymentMethod]);

  useEffect(() => { loadHistory(); }, [selectedStatus, searchName, dateRange, paymentMethod, currentPage, pageSize]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ShipperService.getDeliveryHistory(currentPage, pageSize, {
        status: selectedStatus,
        name: searchName,
        dateFrom: dateRange ? dateRange[0] : undefined,
        dateTo: dateRange ? dateRange[1] : undefined,
        paymentMethod,
      });
      setOrders(response.orders || []);
      setTotalOrders(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    let totalCOD = 0;
    let delivered = 0;
    orders.forEach(order => {
      if (order.status === 'DELIVERED') delivered++;
      if (order.payment?.method === 'COD' && order.payment?.status === 'COMPLETED') {
        totalCOD += order.totalPrice;
      }
    });
    return { totalCOD, delivered };
  }, [orders]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={4} style={{ marginBottom: 4 }}>
            <HistoryOutlined style={{ marginRight: 8 }} />
            Lịch sử giao hàng
          </Typography.Title>
          <Typography.Text style={{ color: '#6b7280' }}>
            Các đơn hàng đã hoàn thành hoặc đã hủy
          </Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={loadHistory}>Làm mới</Button>
      </div>

      <OrderFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchName={internalSearch}
        setSearchName={setInternalSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalOrders={totalOrders}
        statusOptions={[
          { value: 'DELIVERED', label: 'Đã giao hàng' },
          { value: 'CANCELLED', label: 'Đã hủy' },
        ]}
      />

      <OrderHistoryStats totalOrders={stats.delivered} totalCOD={stats.totalCOD} />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spin size="large" tip="Đang tải lịch sử..." />
        </div>
      ) : error ? (
        <Result status="error" title="Lỗi" subTitle={error} extra={<Button onClick={loadHistory}>Thử lại</Button>} />
      ) : orders.length === 0 ? (
        <Result icon={<HistoryOutlined />} title="Không có đơn hàng" subTitle="Chưa có lịch sử giao hàng" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={() => {}}
              onConfirmPayment={() => {}}
              onShowProofModal={() => {}}
              onShowFailedModal={() => {}}
              onShowChecklistModal={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipperOrderHistoryPage;
