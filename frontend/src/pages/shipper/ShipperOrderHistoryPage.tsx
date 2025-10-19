import React, { useEffect, useState, useRef } from 'react';
import { ShipperService } from '../../services/shipper/shipperService';
import OrderFilter from '../../components/shipper/OrderFilter';
import OrderCard from '../../components/shipper/OrderCard';
import OrderHistoryStats from '../../components/shipper/OrderHistoryStats';

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

  // Debounce searchName
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalSearch, setInternalSearch] = React.useState(searchName);

  useEffect(() => {
    setInternalSearch(searchName);
  }, [searchName]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchName(internalSearch);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [internalSearch]);

  // Reset page về 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [selectedStatus, searchName, dateRange, paymentMethod]);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line
  }, [selectedStatus, searchName, dateRange, paymentMethod, currentPage, pageSize]);

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

  // Thống kê tổng số đơn và tổng tiền COD (Tổng số tiền mặt mà shipper đã thu từ khách hàng)
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
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng đã giao</h1>
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
          { value: 'CANCELLED', label: 'Đã huỷ' }
        ]}
      />
      <OrderHistoryStats totalOrders={stats.delivered} totalCOD={stats.totalCOD} />
      <div className="space-y-4 mt-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div>Không có đơn hàng nào.</div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={() => {}} onConfirmPayment={() => {}} onShowProofModal={() => {}} onShowFailedModal={() => {}} onShowChecklistModal={() => {}} />
          ))
        )}
      </div>
    </div>
  );
};

export default ShipperOrderHistoryPage; 