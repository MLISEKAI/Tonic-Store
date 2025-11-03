import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import {
  Button,
  Modal,
  notification,
  Spin,
  Timeline,
  Rate,
  Form,
  Input,
  Card,
  Descriptions,
  List,
  Divider,
  Space
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  UserOutlined,
  StarOutlined,
  BankOutlined
} from '@ant-design/icons';
import { OrderService } from '../../services/order/orderService';
import { PaymentService } from '../../services/order/paymentService';
import { ShipperService } from '../../services/shipper/shipperService';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

interface Payment {
  method: string;
  status: string;
    transactionId?: string;
    paymentDate?: string;
}

interface DeliveryLog {
  id: number;
  status: string;
  note?: string;
  createdAt: string;
  delivery: {
    name: string;
    phone: string;
  };
}

interface ShipperRating {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface Order {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
  promotionCode?: string;
  discount: number;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [shipperRating, setShipperRating] = useState<ShipperRating | null>(null);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingForm] = Form.useForm();
  const [bankTransferModalVisible, setBankTransferModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!isAuthenticated) {
          window.location.href = '/';
          return;
        }
        if (!id || isNaN(parseInt(id))) {
          setError('ID đơn hàng không hợp lệ');
          setLoading(false);
          return;
        }
        const data = await OrderService.getOrder(parseInt(id));
        if (!data) throw new Error();
        setOrder(data as Order);
        const logs = await ShipperService.getOrderDeliveryLogs(data.id);
        setDeliveryLogs(logs as DeliveryLog[]);
        
        // Chỉ lấy đánh giá nếu đơn hàng đã được giao
        if (data.status === 'DELIVERED') {
          try {
            const rating = await ShipperService.getShipperRating(data.id);
            setShipperRating(rating as ShipperRating);
          } catch (error) {
            // Chưa có đánh giá cho đơn hàng này
            setShipperRating(null);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Không thể tải chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!isAuthenticated || !searchParams.get('vnp_ResponseCode')) return;
      try {
        const paymentData = {
          vnp_Amount: searchParams.get('vnp_Amount') || '',
          vnp_BankCode: searchParams.get('vnp_BankCode') || '',
          vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || '',
          vnp_CardType: searchParams.get('vnp_CardType') || '',
          vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
          vnp_PayDate: searchParams.get('vnp_PayDate') || '',
          vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
          vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
          vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || '',
          vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
          vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
          vnp_SecureHash: searchParams.get('vnp_SecureHash') || ''
        };
        const result = await PaymentService.verifyPayment(paymentData);
        notification[result.success ? 'success' : 'error']({
          message: result.success ? 'Thành công' : 'Lỗi',
          description: result.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại.',
        });
      } catch {
        notification.error({ message: 'Lỗi', description: 'Lỗi xác thực thanh toán' });
      }
    };
    verifyPayment();
  }, [searchParams, isAuthenticated]);

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleOutlined className="text-green-600" />;
      case 'FAILED': return <CloseCircleOutlined className="text-red-600" />;
      case 'REFUNDED': return <CloseCircleOutlined className="text-orange-600" />;
      default: return <ClockCircleOutlined className="text-yellow-600" />;
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockCircleOutlined className="text-yellow-600" />;
      case 'CONFIRMED': return <CheckCircleOutlined className="text-blue-600" />;
      case 'PROCESSING': return <ClockCircleOutlined className="text-blue-600" />;
      case 'SHIPPED': return <CarOutlined className="text-orange-600" />;
      case 'DELIVERED': return <CheckCircleOutlined className="text-green-600" />;
      case 'CANCELLED': return <CloseCircleOutlined className="text-red-600" />;
      default: return <ClockCircleOutlined className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const handleRateShipper = async (values: { rating: number; comment?: string }) => {
    if (!order) return;
    try {
      const rating = await ShipperService.rateShipper(order.id, values.rating, values.comment);
      setShipperRating(rating as ShipperRating);
      setIsRatingModalVisible(false);
      notification.success({ message: 'Đánh giá thành công' });
    } catch (error: any) {
      if (error?.response?.data?.error === 'Shipper cannot rate their own delivery') {
        notification.error({
          message: 'Không thể đánh giá',
          description: 'Shipper không thể tự đánh giá chính mình.',
        });
      } else {
        notification.error({ message: 'Lỗi gửi đánh giá' });
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>

      <Card title="Thông tin đơn hàng">
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Trạng thái">{getStatusLabel(order.status)}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{formatDate(order.createdAt)}</Descriptions.Item>
          {order.promotionCode && (
            <>
              <Descriptions.Item label="Mã giảm giá đã áp dụng">
                <span className="text-green-600 font-semibold">{order.promotionCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền được giảm">
                <span className="text-red-600 font-semibold">-{formatPrice(order.discount)}</span>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Tổng tiền">
            <strong className="text-indigo-600">{formatPrice(order.totalPrice)}</strong>
          </Descriptions.Item>
          {order.payment && (
            <>
              <Descriptions.Item label="Phương thức thanh toán">{order.payment.method}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Space>{getPaymentStatusIcon(order.payment.status)} {order.payment.status}</Space>
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
        {order.payment?.method === 'BANK_TRANSFER' && (
          <div className="mt-4">
            <Button icon={<BankOutlined />} onClick={() => setBankTransferModalVisible(true)}>
              Xem thông tin chuyển khoản
            </Button>
          </div>
        )}
      </Card>

      <Card title="Sản phẩm trong đơn hàng">
        <List
          itemLayout="horizontal"
          dataSource={order.items}
          renderItem={(item: OrderItem) => (
            <List.Item>
              <List.Item.Meta
                avatar={<img src={item.product.imageUrl} className="w-16 h-16 object-cover rounded" />}
                title={item.product.name}
                description={`Số lượng: ${item.quantity}`}
              />
              <div className="text-indigo-600 font-semibold">{formatPrice(item.price * item.quantity)}</div>
            </List.Item>
          )}
        />
        <Divider />
        <div className="text-right font-bold text-lg text-indigo-600">
          Tổng cộng: {formatPrice(order.totalPrice)}
          {order.promotionCode && order.discount > 0 && (
            <div className="text-sm text-green-600 font-normal">Đã áp dụng mã: <b>{order.promotionCode}</b> (-{formatPrice(order.discount)})</div>
          )}
        </div>
      </Card>

      <Card title="Lịch sử giao hàng">
        <Timeline>
          {deliveryLogs.map((log: DeliveryLog) => (
            <Timeline.Item key={log.id} dot={getDeliveryStatusIcon(log.status)}>
              <div>
                <p className="font-medium">{getStatusLabel(log.status)}</p>
                <p className="text-gray-500">{formatDate(log.createdAt)}</p>
                {log.note && <p className="text-sm italic text-gray-500">{log.note}</p>}
                {log.delivery && (
                  <p className="mt-1 flex items-center gap-1 text-gray-600">
                    <UserOutlined /> {log.delivery.name} - {log.delivery.phone}
                  </p>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

        {order.status === 'DELIVERED' && (
        <Card title="Đánh giá shipper">
            {shipperRating ? (
            <>
                  <Rate disabled defaultValue={shipperRating.rating} />
              <p className="text-gray-500 mt-1">{shipperRating.comment}</p>
              <p className="text-sm text-gray-400">{formatDate(shipperRating.createdAt)}</p>
            </>
          ) : (
            <Button icon={<StarOutlined />} onClick={() => setIsRatingModalVisible(true)}>
                Đánh giá shipper
              </Button>
            )}
        </Card>
        )}

        <Modal
          title="Đánh giá shipper"
          open={isRatingModalVisible}
          onCancel={() => setIsRatingModalVisible(false)}
          footer={null}
        >
        <Form form={ratingForm} onFinish={handleRateShipper} layout="vertical">
          <Form.Item name="rating" label="Số sao" rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
              <Rate />
            </Form.Item>
          <Form.Item name="comment" label="Nhận xét">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit">Gửi đánh giá</Button>
            </Form.Item>
          </Form>
        </Modal>

      <Modal
        title="Thông tin chuyển khoản"
        open={bankTransferModalVisible}
        onCancel={() => setBankTransferModalVisible(false)}
        footer={[<Button key="close" onClick={() => setBankTransferModalVisible(false)}>Đóng</Button>]}
      >
        <div className="space-y-2">
          <p><strong>Ngân hàng:</strong> Vietcombank</p>
          <p><strong>Số tài khoản:</strong> 0123456789</p>
          <p><strong>Chủ tài khoản:</strong> CÔNG TY ABC</p>
          <p><strong>Số tiền:</strong> {formatPrice(order.totalPrice)}</p>
          <p><strong>Nội dung:</strong> THANH TOAN DH#{order.id}</p>
      </div>
        <Divider />
        <p className="text-sm text-gray-600">
          Gửi biên lai về Zalo 098xxxx hoặc email support@abc.vn để được xác nhận sớm.
        </p>
      </Modal>
    </div>
  );
};

export default OrderDetailPage; 