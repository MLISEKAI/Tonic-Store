import React, { useState, useEffect } from 'react';
import { Table, Button, Select, notification, Modal, Input, Card, Typography, Descriptions, Divider, Space, Tag } from 'antd';
import { Rate } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import OrderService from '../services/orderService';
import { ShipperService } from '../services/shipperService';
import { OrderDetail, OrderStatus, PaymentStatus } from '../types/order';

const { Title } = Typography;

const orderStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);
  const [deliveryRating, setDeliveryRating] = useState<{ rating: number; comment?: string; createdAt: string } | null>(null);
  const [assignShipperModalVisible, setAssignShipperModalVisible] = useState(false);
  const [selectedOrderForShipper, setSelectedOrderForShipper] = useState<OrderDetail | null>(null);
  const [shippers, setShippers] = useState<any[]>([]);
  const [selectedShipperId, setSelectedShipperId] = useState<number | null>(null);
  const [assigningShipper, setAssigningShipper] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await OrderService.getAllOrders({ page, limit: 10 }, status);

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

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      notification.success({
        message: 'Thành công',
        description: 'Order status updated successfully',
        placement: 'topRight',
        duration: 2,
      });
      await fetchOrders();
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Failed to update order status',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      // Cập nhật trạng thái thanh toán
      await OrderService.updatePaymentStatus(selectedOrder.id, 'COMPLETED', transactionId);

      // Tự động cập nhật trạng thái đơn hàng sang CONFIRMED nếu đang ở PENDING
      if (selectedOrder.status === 'PENDING') {
        await OrderService.updateOrderStatus(selectedOrder.id, 'CONFIRMED');
      }

      notification.success({
        message: 'Thành công',
        description: 'Xác nhận thanh toán thành công',
        placement: 'topRight',
        duration: 2,
      });
      setConfirmModalVisible(false);
      setTransactionId('');
      await fetchOrders();
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xác nhận thanh toán',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order: OrderDetail) => {
    setLoading(true);
    try {
      // Lấy thông tin chi tiết mới nhất của đơn hàng
      const orderDetail = await OrderService.getOrder(order.id);
      setSelectedOrderDetail(orderDetail);
      // Lấy đánh giá giao hàng (nếu có)
      try {
        const rating = await ShipperService.getOrderDeliveryRating(parseInt(order.id));
        setDeliveryRating(rating);
      } catch (e) {
        setDeliveryRating(null);
      }
      setDetailModalVisible(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin chi tiết đơn hàng',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShipper = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrderForShipper(order);
    setAssignShipperModalVisible(true);

    setLoading(true);
    try {
      const shipperList = await ShipperService.getAllShippers();
      setShippers(shipperList);
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách shipper',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAssignShipper = async () => {
    if (!selectedOrderForShipper || !selectedShipperId) return;

    setLoading(true);
    try {
      setAssigningShipper(true);
      await ShipperService.assignShipperToOrder(
        parseInt(selectedOrderForShipper.id),
        selectedShipperId
      );

      notification.success({
        message: 'Thành công',
        description: 'Đã gán shipper cho đơn hàng',
        placement: 'topRight',
        duration: 2,
      });

      // Cập nhật lại danh sách đơn hàng
      await fetchOrders();

      // Nếu đang xem chi tiết đơn hàng này, cập nhật lại thông tin
      if (selectedOrderDetail?.id === selectedOrderForShipper.id) {
        // Lấy thông tin chi tiết mới nhất của đơn hàng
        const orderDetail = await OrderService.getOrder(selectedOrderForShipper.id);
        setSelectedOrderDetail(orderDetail);
      }

      setAssignShipperModalVisible(false);
      setSelectedOrderForShipper(null);
      setSelectedShipperId(null);
    } catch (err) {
      console.error('Error assigning shipper:', err);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể gán shipper cho đơn hàng',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setAssigningShipper(false);
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const search = searchText.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.user.name.toLowerCase().includes(search) ||
      order.user.email.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
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
      title: 'Tổng tiền',
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
      title: 'Phương thức thanh toán',
      dataIndex: ['payment', 'method'],
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: ['payment', 'status'],
      key: 'paymentStatus',
      render: (status: PaymentStatus, record: OrderDetail) => {
        const getColor = () => {
          switch (status?.toUpperCase()) {
            case 'PENDING':
              return '#D97706'; // vàng đậm
            case 'COMPLETED':
              return '#16A34A'; // xanh lá
            case 'FAILED':
              return '#DC2626'; // đỏ
            case 'REFUNDED':
              return '#2563EB'; // xanh dương
            default:
              return '#6B7280'; // xám
          }
        };

        return (
          <Space size="small">
            <span style={{ color: getColor(), fontWeight: 500 }}>
              {status}
            </span>
            {status === 'PENDING' &&
              record.status !== 'CANCELLED' &&
              record.payment?.method === 'BANK_TRANSFER' && (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setSelectedOrder(record);
                    setConfirmModalVisible(true);
                  }}
                >
                  Xác nhận chuyển khoản
                </Button>
              )}
          </Space>
        );
      },
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Được tạo vào lúc',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi }),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 250,
      render: (_: unknown, record: OrderDetail) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          {(record.status === 'CONFIRMED' || (record.status === 'PENDING' && record.payment?.method === 'COD')) && (
            <Button
              type="primary"
              onClick={() => handleAssignShipper(record.id)}
            >
              Gán shipper
            </Button>
          )}
          {getNextValidStatusOptions(record).length > 0 && (
            <Select
              style={{ width: 120 }}
              placeholder="Cập nhật trạng thái"
              onChange={(value) => handleStatusChange(record.id, value)}
            >
              {getNextValidStatusOptions(record).map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )}
        </Space>
      ),
    },
  ];

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
          Quản lý đơn hàng
        </Title>

        <div style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            allowClear
            placeholder="Tìm mã đơn, tên, email..."
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
            value={searchText}
          />

          <Select<OrderStatus | ''>
            value={status}
            onChange={(value: OrderStatus | '') => {
              setStatus(value);
            }}
            style={{ width: 200 }}
            placeholder="Lọc theo trạng thái"
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              ...orderStatusOptions
            ]}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Không tìm thấy đơn đặt hàng</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            current: page,
            total: totalPages * 10,
            onChange: (page: number) => setPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
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
        width={1000}
        footer={null}
      >
        {selectedOrderDetail && (
          <div className="space-y-6">
            <Descriptions title="Thông tin khách hàng" bordered>
              <Descriptions.Item label="Tên">{selectedOrderDetail.user?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrderDetail.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedOrderDetail.shippingPhone}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thông tin giao hàng" bordered>
              <Descriptions.Item label="Tên">{selectedOrderDetail.shippingName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedOrderDetail.shippingPhone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={3}>{selectedOrderDetail.shippingAddress}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thông tin đơn hàng" bordered>
              <Descriptions.Item label="Ngày đặt hàng">
                {format(new Date(selectedOrderDetail.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrderDetail.status)}>
                  {getStatusLabel(selectedOrderDetail.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrderDetail.payment?.method}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={selectedOrderDetail.payment?.status === 'COMPLETED' ? 'success' : selectedOrderDetail.payment?.status === 'PENDING' ? 'warning' : selectedOrderDetail.payment?.status === 'FAILED' ? 'error' : 'default'}>
                  {selectedOrderDetail.payment?.status}
                </Tag>
              </Descriptions.Item>
              {selectedOrderDetail.promotionCode && (
                <Descriptions.Item label="Mã giảm giá đã áp dụng">
                  <span className="text-green-600 font-semibold">{selectedOrderDetail.promotionCode}</span>
                </Descriptions.Item>
              )}
              {selectedOrderDetail.discount > 0 && (
                <Descriptions.Item label="Số tiền được giảm">
                  <span className="text-red-600 font-semibold">-{selectedOrderDetail.discount.toLocaleString('vi-VN')}₫</span>
                </Descriptions.Item>
              )}
              {selectedOrderDetail.payment?.transactionId && (
                <Descriptions.Item label="Mã giao dịch">
                  {selectedOrderDetail.payment.transactionId}
                </Descriptions.Item>
              )}
              {selectedOrderDetail.payment?.paymentDate && (
                <Descriptions.Item label="Ngày thanh toán">
                  {format(new Date(selectedOrderDetail.payment.paymentDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedOrderDetail.shipper && (
              <Descriptions title="Thông tin shipper" bordered>
                <Descriptions.Item label="Tên">{selectedOrderDetail.shipper.name}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedOrderDetail.shipper.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedOrderDetail.shipper.email}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{selectedOrderDetail.shipper.address}</Descriptions.Item>
                <Descriptions.Item label="Được giao vào lúc">
                  {format(new Date(selectedOrderDetail.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Descriptions.Item>
              </Descriptions>
            )}

            {deliveryRating && (
              <Descriptions title="Đánh giá của người dùng" bordered>
                <Descriptions.Item label="Số sao">
                  <Rate disabled defaultValue={deliveryRating.rating} />
                </Descriptions.Item>
                {deliveryRating.comment && (
                  <Descriptions.Item label="Nhận xét" span={3}>
                    {deliveryRating.comment}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Thời gian">
                  {format(new Date(deliveryRating.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Descriptions.Item>
              </Descriptions>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
              <Table
                dataSource={selectedOrderDetail.items}
                pagination={false}
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: ['product', 'name'],
                    key: 'product',
                  },
                  {
                    title: 'Giá',
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
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Tổng tiền',
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
                  Tổng tiền: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedOrderDetail.totalPrice)}
                  {selectedOrderDetail.promotionCode && selectedOrderDetail.discount > 0 && (
                    <div className="text-sm text-green-600 font-normal">Đã áp dụng mã: <b>{selectedOrderDetail.promotionCode}</b> (-{selectedOrderDetail.discount.toLocaleString('vi-VN')}₫)</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Gán shipper cho đơn hàng"
        open={assignShipperModalVisible}
        onOk={handleConfirmAssignShipper}
        onCancel={() => {
          setAssignShipperModalVisible(false);
          setSelectedOrderForShipper(null);
          setSelectedShipperId(null);
        }}
        confirmLoading={assigningShipper}
      >
        {selectedOrderForShipper && (
          <div className="space-y-4">
            <p>
              <strong>Mã đơn hàng:</strong> #{selectedOrderForShipper.id}
            </p>
            <p>
              <strong>Khách hàng:</strong> {selectedOrderForShipper.user.name}
            </p>
            <p>
              <strong>Địa chỉ giao hàng:</strong> {selectedOrderForShipper.shippingAddress}
            </p>
            <div>
              <p className="mb-2"><strong>Chọn shipper:</strong></p>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn shipper"
                onChange={(value) => setSelectedShipperId(value)}
                value={selectedShipperId}
              >
                {shippers.map((shipper) => (
                  <Select.Option key={shipper.id} value={shipper.id}>
                    {shipper.name} - {shipper.phone}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default OrderList;