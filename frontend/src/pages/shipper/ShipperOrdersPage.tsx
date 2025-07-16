import React, { useEffect, useState } from 'react';
import { ShipperService } from '../../services/shipper/shipperService';
import { OrderStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/format';
import { PaymentService } from '../../services/order/paymentService';

interface Order {
  id: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      price: number;
      imageUrl: string;
    };
    quantity: number;
  }>;
  payment?: {
    method: string;
    status: string;
  };
}

const ShipperOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      if (isAuthenticated && user?.role === 'DELIVERY') {
        try {
          await loadOrders();
        } catch (err) {
          console.error('Error in useEffect:', err);
        }
      } else {
        setError('Please login as a delivery staff to view orders');
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [selectedStatus, isAuthenticated, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to load orders...');
      
      if (!user?.id) {
        throw new Error('User ID not found. Please login again.');
      }
      
      console.log('User info:', { id: user.id, role: user.role });
      
      const response = await ShipperService.getDeliveryOrders(1, 10);
      console.log('Received orders data:', response);
      
      if (!response.orders || !Array.isArray(response.orders)) {
        console.error('Invalid data format received:', response);
        throw new Error('Invalid data format received from server');
      }
      
      const normalized = response.orders.map((order: any) => {
        if (!order.id || !order.status) {
          console.error('Invalid order data:', order);
          throw new Error('Invalid order data received from server');
        }
        return {
          ...order,
          payment: order.payment || { method: '', status: '' }
        };
      });
      
      console.log('Normalized orders:', normalized);
      setOrders(normalized);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
      
      // Show error notification
      if (err.message.includes('Server error')) {
        alert('Có lỗi xảy ra từ server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.');
      } else if (err.message.includes('Network error')) {
        alert('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối internet.');
      } else if (err.message.includes('Session expired')) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.message.includes('permission')) {
        alert('Bạn không có quyền truy cập vào trang này.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      await ShipperService.updateDeliveryStatus(orderId, newStatus);
      await loadOrders();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(err.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleConfirmReceivedPayment = async (orderId: number) => {
    try {
      console.log('Confirming COD payment for order:', orderId);
      await PaymentService.confirmCODPayment(orderId);
      await loadOrders();
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      alert(err.message || 'Xác nhận nhận tiền thất bại!');
    }
  };

  if (!isAuthenticated || user?.role !== 'DELIVERY') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
          <p>Vui lòng đăng nhập với vai trò là nhân viên giao hàng để xem đơn hàng</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Lỗi</h2>
          <p>{error}</p>
          <button 
            onClick={loadOrders}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (orders.some(order => !order.payment || !order.payment.method)) {
    return <div className="text-red-500">Dữ liệu đơn hàng thiếu thông tin thanh toán. Hãy kiểm tra lại backend!</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      {/* Filter by status */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="SHIPPED">Đang giao hàng</option>
          <option value="DELIVERED">Đã giao hàng</option>
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">Đơn hàng #{order.id}</h2>
                <p className="text-gray-600">
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Tổng tiền: {order.totalPrice.toLocaleString()}đ</p>
                <p className="text-gray-600">Trạng thái: {order.status}</p>
              </div>
            </div>

            {/* Order items */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sản phẩm:</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600">
                        {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping info */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Thông tin giao hàng:</h3>
              <p>Người nhận: {order.shippingName}</p>
              <p>Số điện thoại: {order.shippingPhone}</p>
              <p>Địa chỉ: {order.shippingAddress}</p>
            </div>

            {/* Status update */}
            <div className="flex space-x-2">
              {order.status === OrderStatus.PROCESSING && (
                <button
                  onClick={() => handleStatusChange(order.id, OrderStatus.SHIPPED)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Bắt đầu giao hàng
                </button>
              )}
              {order.status === OrderStatus.SHIPPED && (
                <button
                  onClick={() => handleStatusChange(order.id, OrderStatus.DELIVERED)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Xác nhận đã giao
                </button>
              )}
              {order.status === OrderStatus.DELIVERED && order.payment?.method === 'COD' && order.payment?.status === 'PENDING' && (
                <button
                  onClick={() => handleConfirmReceivedPayment(order.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Xác nhận đã nhận tiền
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipperOrders; 