import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { formatPrice, formatDate } from '../utils/format';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch order');

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus) {
      // Show payment status message
      const message = paymentStatus === 'COMPLETED' 
        ? 'Thanh toán thành công!' 
        : 'Thanh toán thất bại. Vui lòng thử lại.';
      alert(message);
    }
  }, [searchParams]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found</div>;

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
                  <p><span className="font-medium">Trạng thái thanh toán:</span> {order.payment.status}</p>
                  {order.payment.transactionId && (
                    <p><span className="font-medium">Mã giao dịch:</span> {order.payment.transactionId}</p>
                  )}
                  {order.payment.paymentDate && (
                    <p><span className="font-medium">Ngày thanh toán:</span> {formatDate(order.payment.paymentDate)}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Người nhận:</span> {order.shippingName}</p>
              <p><span className="font-medium">Điện thoại:</span> {order.shippingPhone}</p>
              <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
              {order.note && <p><span className="font-medium">Ghi chú:</span> {order.note}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-gray-500">{formatPrice(item.price)}/sản phẩm</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 