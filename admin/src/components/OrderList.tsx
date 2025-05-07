import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Spin, Modal, Input } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import OrderService, { Order, OrderResponse } from '../services/orderService';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY';

const orderStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const paymentStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getAllOrders(page, status);

      // Kiểm tra nếu response là mảng
      const ordersArray = Array.isArray(response) ? response : response.orders;
      
      // Lọc orders theo status nếu có
      const filteredOrders = status 
        ? ordersArray.filter((order: Order) => order.status === status)
        : ordersArray;
      
      const formattedOrders = filteredOrders.map((order: Order) => ({
        ...order,
        id: order.id.toString(),
        totalAmount: Number(order.totalPrice),
      }));
      
      setOrders(formattedOrders);
      setTotalPages(Math.ceil(filteredOrders.length / 10));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      message.success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      message.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: PaymentStatus) => {
    if (newStatus === 'COMPLETED') {
      setSelectedOrder(orders.find(order => order.id === orderId) || null);
      setConfirmModalVisible(true);
    } else {
    try {
        await OrderService.updatePaymentStatus(orderId, newStatus);
      message.success('Payment status updated successfully');
      fetchOrders();
    } catch (err) {
      message.error('Failed to update payment status');
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;
    
    // Kiểm tra mã giao dịch nếu là chuyển khoản
    if (selectedOrder.payment?.method === 'BANK_TRANSFER' && !transactionId) {
      message.error('Vui lòng nhập mã giao dịch chuyển khoản');
      return;
    }
    
    try {
      await OrderService.updatePaymentStatus(selectedOrder.id, 'COMPLETED', transactionId);
      message.success('Xác nhận thanh toán thành công');
      setConfirmModalVisible(false);
      setTransactionId('');
      fetchOrders();
    } catch (err) {
      message.error('Không thể xác nhận thanh toán');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: ['user', 'name'],
      key: 'customer',
      render: (text: string, record: Order) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-500">{record.user.email}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(amount)
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: ['payment', 'method'],
      key: 'paymentMethod',
    },
    {
      title: 'Payment Status',
      dataIndex: ['payment', 'status'],
      key: 'paymentStatus',
      render: (status: PaymentStatus, record: Order) => (
        <div className="flex items-center gap-2">
          <span className={status === 'PENDING' ? 'text-yellow-600' : 
                          status === 'COMPLETED' ? 'text-green-600' : 
                          status === 'FAILED' ? 'text-red-600' : 'text-gray-600'}>
            {status}
          </span>
          {status === 'PENDING' && 
          record.status !== 'CANCELLED' &&
          (record.payment?.method === 'COD' || record.payment?.method === 'BANK_TRANSFER') && (
            <Button 
              type="primary"
              size="small"
              onClick={() => {
                setSelectedOrder(record);
                setConfirmModalVisible(true);
              }}
            >
              {record.payment?.method === 'BANK_TRANSFER' ? 'Xác nhận chuyển khoản' : 'Xác nhận thanh toán'}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: Order) => (
        <Select<OrderStatus>
          value={status}
          onChange={(value: OrderStatus) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
          options={orderStatusOptions}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Order) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/orders/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Select<OrderStatus | ''>
          value={status}
          onChange={(value: OrderStatus | '') => {
            setStatus(value);
          }}
          style={{ width: 200 }}
          placeholder="Filter by status"
          options={[
            { value: '', label: 'All Status' },
            ...orderStatusOptions
          ]}
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No orders found</div>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            current: page,
            total: totalPages * 10,
            onChange: (page: number) => setPage(page),
            showSizeChanger: false,
          }}
          loading={loading}
        />
      )}

      <Modal
        title={selectedOrder?.payment?.method === 'BANK_TRANSFER' ? "Xác nhận chuyển khoản" : "Xác nhận thanh toán"}
        open={confirmModalVisible}
        onOk={handleConfirmPayment}
        onCancel={() => {
          setConfirmModalVisible(false);
          setTransactionId('');
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <p>
            {selectedOrder?.payment?.method === 'BANK_TRANSFER' 
              ? `Bạn có chắc chắn muốn xác nhận chuyển khoản cho đơn hàng #${selectedOrder?.id}?`
              : `Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng #${selectedOrder?.id}?`
            }
          </p>
          {selectedOrder?.payment?.method === 'BANK_TRANSFER' && (
            <div>
              <p className="mb-2">Mã giao dịch chuyển khoản <span className="text-red-500">*</span></p>
              <Input
                value={transactionId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                placeholder="Nhập mã giao dịch chuyển khoản"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Mã giao dịch này được cung cấp bởi ngân hàng khi khách hàng thực hiện chuyển khoản
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OrderList;