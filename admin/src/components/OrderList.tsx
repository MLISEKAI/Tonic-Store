import React, { useState, useEffect } from 'react';
import { Table, Button, Select, notification, Spin, Modal, Input, Card, Typography, Tag, Descriptions, Divider } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import OrderService, { Order } from '../services/orderService';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY';

interface OrderDetail extends Omit<Order, 'status' | 'items'> {
  status: OrderStatus;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }>;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
}

const { Title } = Typography;

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
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);

  const getNextValidStatusOptions = (order: OrderDetail) => {
    const current = order.status;
    const paid = order.payment?.status === 'COMPLETED';

    switch (current) {
      case 'PENDING':
        return paid
          ? [] // Không cho phép thay đổi trạng thái nếu đã thanh toán
          : orderStatusOptions.filter(o => o.value === 'CANCELLED');
      case 'PROCESSING':
        return orderStatusOptions.filter(o => o.value === 'SHIPPED' || o.value === 'CANCELLED');
      case 'SHIPPED':
        return orderStatusOptions.filter(o => o.value === 'DELIVERED');
      case 'DELIVERED':
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'processing';
      case 'SHIPPED':
        return 'purple';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return orderStatusOptions.find(opt => opt.value === status)?.label || status;
  };

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
        ? ordersArray.filter((order: OrderDetail) => order.status === status)
        : ordersArray;
      
      const formattedOrders = filteredOrders.map((order: OrderDetail) => ({
        ...order,
        id: order.id.toString(),
        totalPrice: Number(order.totalPrice),
      }));
      
      setOrders(formattedOrders);
      setTotalPages(Math.ceil(filteredOrders.length / 10));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      notification.error({
        message: 'Lỗi',
        description: 'Failed to fetch orders',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      notification.success({
        message: 'Thành công',
        description: 'Order status updated successfully',
        placement: 'topRight',
        duration: 2,
      });
      fetchOrders();
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Failed to update order status',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: PaymentStatus) => {
    if (newStatus === 'COMPLETED') {
      setSelectedOrder(orders.find(order => order.id === orderId) || null);
      setConfirmModalVisible(true);
    } else {
      try {
        await OrderService.updatePaymentStatus(orderId, newStatus);
        notification.success({
          message: 'Thành công',
          description: 'Payment status updated successfully',
          placement: 'topRight',
          duration: 2,
        });
        fetchOrders();
      } catch (err) {
        notification.error({
          message: 'Lỗi',
          description: 'Failed to update payment status',
          placement: 'topRight',
          duration: 2,
        });
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;
    
    // Kiểm tra mã giao dịch nếu là chuyển khoản
    if (selectedOrder.payment?.method === 'BANK_TRANSFER' && !transactionId) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập mã giao dịch chuyển khoản',
        placement: 'topRight',
        duration: 2,
      });
      return;
    }
    
    try {
      // Cập nhật trạng thái thanh toán
      await OrderService.updatePaymentStatus(selectedOrder.id, 'COMPLETED', transactionId);
      
      // Tự động cập nhật trạng thái đơn hàng sang PROCESSING nếu đang ở PENDING
      if (selectedOrder.status === 'PENDING') {
        await OrderService.updateOrderStatus(selectedOrder.id, 'PROCESSING');
      }
      
      notification.success({
        message: 'Thành công',
        description: 'Xác nhận thanh toán thành công',
        placement: 'topRight',
        duration: 2,
      });
      setConfirmModalVisible(false);
      setTransactionId('');
      fetchOrders();
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xác nhận thanh toán',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const handleViewDetails = (order: OrderDetail) => {
    setSelectedOrderDetail(order);
    setDetailModalVisible(true);
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
      render: (text: string, record: OrderDetail) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-500">{record.user.email}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
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
      render: (status: PaymentStatus, record: OrderDetail) => (
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
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
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
      render: (text: string, record: OrderDetail) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Order Management
        </Title>

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

      <Modal
        title={`Order Details #${selectedOrderDetail?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedOrderDetail && (
          <div className="space-y-6">
            <Descriptions title="Customer Information" bordered>
              <Descriptions.Item label="Name">{selectedOrderDetail.user.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrderDetail.user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrderDetail.shippingPhone}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Shipping Information" bordered>
              <Descriptions.Item label="Name">{selectedOrderDetail.shippingName}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrderDetail.shippingPhone}</Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>{selectedOrderDetail.shippingAddress}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Order Information" bordered>
              <Descriptions.Item label="Order Date">
                {format(new Date(selectedOrderDetail.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrderDetail.status)}>
                  {getStatusLabel(selectedOrderDetail.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrderDetail.payment?.method}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrderDetail.payment?.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {selectedOrderDetail.payment?.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <Table
                dataSource={selectedOrderDetail.items}
                pagination={false}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: ['product', 'name'],
                    key: 'product',
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price: number) => (
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(price)
                    ),
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Total',
                    key: 'total',
                    render: (_, record) => (
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(record.price * record.quantity)
                    ),
                  },
                ]}
              />
            </div>

            <Divider />

            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Total Amount: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedOrderDetail.totalPrice)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default OrderList;