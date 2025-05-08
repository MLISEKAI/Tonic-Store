import React, { useEffect, useState } from 'react';
import { ShipperService } from '../../services/shipperService';
import { OrderStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

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
}

const ShipperOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [selectedStatus, token]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ShipperService.getShipperOrders(selectedStatus);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus, note?: string) => {
    try {
      await ShipperService.updateDeliveryStatus(orderId, newStatus, note);
      loadOrders(); // Reload orders after status update
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (!token) {
    return <div className="text-red-500">Please login to view orders</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
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
                        {item.quantity} x {item.product.price.toLocaleString()}đ
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipperOrders; 