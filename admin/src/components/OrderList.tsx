import React, { useState, useEffect } from 'react';
import { Table, Button, Select, message, Spin } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import OrderService, { Order, OrderResponse } from '../services/orderservice';

const { Option } = Select;

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response: OrderResponse = await OrderService.getAllOrders(page, status);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (err) {
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

  const handlePaymentStatusChange = async (orderId: string, newStatus: PaymentStatus, transactionId?: string) => {
    try {
      await OrderService.updatePaymentStatus(orderId, newStatus, transactionId);
      message.success('Payment status updated successfully');
      fetchOrders();
    } catch (err) {
      message.error('Failed to update payment status');
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: Order) => (
        <Select<OrderStatus>
          value={status}
          onChange={(value: OrderStatus) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="PROCESSING">Processing</Option>
          <Option value="SHIPPED">Shipped</Option>
          <Option value="DELIVERED">Delivered</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: PaymentStatus, record: Order) => (
        <Select<PaymentStatus>
          value={status}
          onChange={(value: PaymentStatus) => handlePaymentStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="PAID">Paid</Option>
          <Option value="FAILED">Failed</Option>
          <Option value="REFUNDED">Refunded</Option>
        </Select>
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
        <Button type="link" onClick={() => window.location.href = `/orders/${record.id}`}>
          View Details
        </Button>
      ),
    },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      <div className="mb-4">
        <Select<OrderStatus | ''>
          value={status}
          onChange={(value: OrderStatus | '') => setStatus(value)}
          style={{ width: 200 }}
          placeholder="Filter by status"
        >
          <Option value="">All Status</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="PROCESSING">Processing</Option>
          <Option value="SHIPPED">Shipped</Option>
          <Option value="DELIVERED">Delivered</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: page,
          total: totalPages * 10,
          onChange: (page: number) => setPage(page),
        }}
      />
    </div>
  );
};

export default OrderList; 