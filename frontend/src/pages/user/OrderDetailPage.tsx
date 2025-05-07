import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/format';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { message, Button, Modal, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  note?: string;
  items: OrderItem[];
  payment?: {
    status: string;
    method: string;
    transactionId?: string;
    paymentDate?: string;
  };
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Validate order ID
        if (!id) {
          setError('Không tìm thấy ID đơn hàng');
          setLoading(false);
          return;
        }

        const orderId = parseInt(id);
        if (isNaN(orderId)) {
          setError('ID đơn hàng không hợp lệ');
          setLoading(false);
          return;
        }

        const data = await api.getOrder(token, orderId);
        
        if (!data) {
          setError('Không tìm thấy đơn hàng');
          setLoading(false);
          return;
        }
        
        // Transform data to match our interface
        const transformedOrder: Order = {
          ...data,
          userId: data.userId,
          shippingAddress: data.shippingAddress,
          shippingPhone: data.shippingPhone,
          shippingName: data.shippingName,
          items: data.items.map((item: any) => ({
            ...item,
            productId: item.productId,
            orderId: item.orderId,
            quantity: item.quantity,
            price: item.price
          }))
        };
        
        setOrder(transformedOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  useEffect(() => {
    const verifyPayment = async () => {
      const vnp_Amount = searchParams.get('vnp_Amount');
      const vnp_BankCode = searchParams.get('vnp_BankCode');
      const vnp_BankTranNo = searchParams.get('vnp_BankTranNo');
      const vnp_CardType = searchParams.get('vnp_CardType');
      const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
      const vnp_PayDate = searchParams.get('vnp_PayDate');
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const vnp_TmnCode = searchParams.get('vnp_TmnCode');
      const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
      const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const vnp_SecureHash = searchParams.get('vnp_SecureHash');

      if (vnp_ResponseCode && token) {
        try {
          const data = await api.verifyPayment(token, {
            vnp_Amount: vnp_Amount || '',
            vnp_BankCode: vnp_BankCode || '',
            vnp_BankTranNo: vnp_BankTranNo || '',
            vnp_CardType: vnp_CardType || '',
            vnp_OrderInfo: vnp_OrderInfo || '',
            vnp_PayDate: vnp_PayDate || '',
            vnp_ResponseCode: vnp_ResponseCode || '',
            vnp_TmnCode: vnp_TmnCode || '',
            vnp_TransactionNo: vnp_TransactionNo || '',
            vnp_TransactionStatus: vnp_TransactionStatus || '',
            vnp_TxnRef: vnp_TxnRef || '',
            vnp_SecureHash: vnp_SecureHash || ''
          });

          if (data.success) {
            notification.success({
              message: 'Thành công',
              description: 'Thanh toán thành công!',
              placement: 'topRight',
              duration: 2,
            });
          } else {
            notification.error({
              message: 'Lỗi',
              description: 'Thanh toán thất bại. Vui lòng thử lại.',
              placement: 'topRight',
              duration: 2,
            });
          }
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: 'Có lỗi xảy ra khi xác thực thanh toán',
            placement: 'topRight',
            duration: 2,
          });
        }
      }
    };

    verifyPayment();
  }, [searchParams, token]);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'REFUNDED':
        return 'text-orange-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleOutlined className="text-green-600" />;
      case 'FAILED':
        return <CloseCircleOutlined className="text-red-600" />;
      case 'REFUNDED':
        return <CloseCircleOutlined className="text-orange-600" />;
      default:
        return <ClockCircleOutlined className="text-yellow-600" />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Chi tiết đơn hàng #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Trạng thái:</span> {order.status}</p>
              <p><span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}</p>
              <p><span className="font-medium">Tổng tiền:</span> {formatPrice(order.totalPrice)}</p>
              {order.payment && (
                <>
                  <p><span className="font-medium">Phương thức thanh toán:</span> {order.payment.method}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span className={getPaymentStatusColor(order.payment.status)}>
                      {getPaymentStatusIcon(order.payment.status)}
                      {order.payment.status}
                    </span>
                  </p>
                  {order.payment.transactionId && (
                    <p><span className="font-medium">Mã giao dịch:</span> {order.payment.transactionId}</p>
                  )}
                  {order.payment.paymentDate && (
                    <p><span className="font-medium">Ngày thanh toán:</span> {formatDate(order.payment.paymentDate)}</p>
                  )}
                  {order.payment.status === 'PENDING' && (
                    <p className="text-yellow-600 mt-2">
                      Đơn hàng đang chờ xác nhận thanh toán từ admin
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Họ tên:</span> {order.shippingName}</p>
              <p><span className="font-medium">Số điện thoại:</span> {order.shippingPhone}</p>
              <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
              {order.note && (
                <p><span className="font-medium">Ghi chú:</span> {order.note}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-indigo-600 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-indigo-600">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 