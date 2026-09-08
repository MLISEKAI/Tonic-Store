import React from 'react';
import { formatPrice } from '../../utils/format';
import { OrderStatus } from '../../types';
import dayjs from 'dayjs';
import OrderStatusActions from './OrderStatusActions';
import { Tag, Typography } from 'antd';
import { ClockCircleOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onConfirmPayment: (orderId: number) => void;
  onShowProofModal: () => void;
  onShowFailedModal: () => void;
  onShowChecklistModal: () => void;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ xử lý' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'cyan', label: 'Đang xử lý' },
  SHIPPED: { color: 'purple', label: 'Đang giao' },
  DELIVERED: { color: 'green', label: 'Đã giao' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
  FAILED: { color: 'red', label: 'Thất bại' },
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onConfirmPayment,
  onShowProofModal,
  onShowFailedModal,
  onShowChecklistModal,
}) => {
  const statusCfg = STATUS_CONFIG[order.status] || { color: 'default', label: order.status };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Typography.Text strong style={{ fontSize: 16 }}>
            #{order.id}
          </Typography.Text>
          <Tag color={statusCfg.color} style={{ margin: 0 }}>{statusCfg.label}</Tag>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Typography.Text strong style={{ fontSize: 16, color: '#ef4444' }}>
            {formatPrice(order.totalPrice)}
          </Typography.Text>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            <ClockCircleOutlined /> {dayjs(order.createdAt).format('HH:mm DD/MM')}
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {order.items?.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: '#f9fafb',
                borderRadius: 8,
                flex: '1 1 200px',
              }}
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.product.name}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {item.quantity} x {formatPrice(item.product.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Info */}
        <div
          style={{
            padding: '12px 16px',
            background: '#f0f9ff',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>
            Thông tin giao hàng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            <span><strong>{order.shippingName}</strong></span>
            <span style={{ color: '#6b7280' }}><PhoneOutlined /> {order.shippingPhone}</span>
            <span style={{ color: '#6b7280' }}><EnvironmentOutlined /> {order.shippingAddress}</span>
          </div>
        </div>

        {/* Payment */}
        {order.payment && (
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
            Thanh toán: <Tag style={{ margin: 0 }}>{order.payment.method}</Tag>
            {order.payment.method === 'COD' && (
              <Tag color={order.payment.status === 'COMPLETED' ? 'green' : 'orange'} style={{ marginLeft: 4 }}>
                {order.payment.status === 'COMPLETED' ? 'Đã nhận tiền' : 'Chưa nhận tiền'}
              </Tag>
            )}
          </div>
        )}

        {/* Actions */}
        <OrderStatusActions
          order={order}
          onStatusChange={onStatusChange}
          onConfirmPayment={onConfirmPayment}
          onShowProofModal={onShowProofModal}
          onShowFailedModal={onShowFailedModal}
          onShowChecklistModal={onShowChecklistModal}
        />
      </div>
    </div>
  );
};

export default OrderCard;
