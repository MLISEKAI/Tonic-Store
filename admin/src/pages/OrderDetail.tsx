import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Table, Button, Spin, message } from "antd";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import OrderService, { Order } from "../services/orderService";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getOrder(id!);
      setOrder(response);
    } catch (err) {
      setError("Failed to fetch order details");
      message.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found</div>;

  const columns = [
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "product",
      render: (text: string, record: OrderItem) => (
        <div className="flex items-center gap-2">
          {record.product.image && (
            <img
              src={record.product.image}
              alt={text}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (text: string, record: OrderItem) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.price * record.quantity),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => navigate("/orders")}>← Back to Orders</Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Order Details #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Order Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Order Status">
              <span
                className={
                  order.status === "PENDING"
                    ? "text-yellow-600"
                    : order.status === "PROCESSING"
                    ? "text-blue-600"
                    : order.status === "SHIPPED"
                    ? "text-purple-600"
                    : order.status === "DELIVERED"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {order.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Order Date">
              {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.totalPrice)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Customer Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Name">
              {order.user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.user.email}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Card title="Order Items" className="mb-6">
        <Table
          columns={columns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {order.payment && (
        <Card title="Payment Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Payment Method">
              {order.payment.method}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <span
                className={
                  order.payment.status === "PENDING"
                    ? "text-yellow-600"
                    : order.payment.status === "COMPLETED"
                    ? "text-green-600"
                    : order.payment.status === "FAILED"
                    ? "text-red-600"
                    : "text-gray-600"
                }
              >
                {order.payment.status}
              </span>
            </Descriptions.Item>
            {order.payment.transactionId && (
              <Descriptions.Item label="Transaction ID">
                {order.payment.transactionId}
              </Descriptions.Item>
            )}
            {order.payment.paymentDate && (
              <Descriptions.Item label="Payment Date">
                {format(
                  new Date(order.payment.paymentDate),
                  "dd/MM/yyyy HH:mm",
                  { locale: vi }
                )}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default OrderDetail;
