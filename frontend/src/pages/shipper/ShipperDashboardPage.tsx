import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Tag, List, Progress } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  CarOutlined, DollarOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { ShipperService } from '../../services/shipper/shipperService';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  DELIVERED: { color: '#10b981', label: 'Đã giao', icon: <CheckCircleOutlined /> },
  SHIPPED: { color: '#3b82f6', label: 'Đang giao', icon: <CarOutlined /> },
  PROCESSING: { color: '#f59e0b', label: 'Đang xử lý', icon: <ClockCircleOutlined /> },
  CANCELLED: { color: '#ef4444', label: 'Đã hủy', icon: <CloseCircleOutlined /> },
  FAILED: { color: '#ef4444', label: 'Thất bại', icon: <CloseCircleOutlined /> },
};

const ShipperDashboardPage: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ total: 0, delivered: 0, shipping: 0, failed: 0, cod: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await ShipperService.getDeliveryHistory(1, 1000);
      const orders = response.orders || [];
      let delivered = 0, shipping = 0, failed = 0, cod = 0;
      orders.forEach((order: any) => {
        if (order.status === 'DELIVERED') delivered++;
        else if (order.status === 'SHIPPED') shipping++;
        else if (order.status === 'FAILED' || order.status === 'CANCELLED') failed++;
        if (order.payment?.method === 'COD' && order.payment?.status === 'COMPLETED') {
          cod += order.totalPrice;
        }
      });
      setStats({ total: orders.length, delivered, shipping, failed, cod });
      setRecentOrders(orders.slice(0, 5));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}><Spin size="large" /></div>;
  if (!isAuthenticated || user?.role !== 'DELIVERY') return <Navigate to="/" />;

  const statCards = [
    { title: 'Tổng đơn hàng', value: stats.total, icon: <CarOutlined />, color: '#3b82f6', bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' },
    { title: 'Đã giao thành công', value: stats.delivered, icon: <CheckCircleOutlined />, color: '#10b981', bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' },
    { title: 'Đang giao', value: stats.shipping, icon: <ClockCircleOutlined />, color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
    { title: 'Tổng tiền COD', value: stats.cod, icon: <DollarOutlined />, color: '#8b5cf6', bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', isCurrency: true },
  ];

  const successRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={4} style={{ marginBottom: 4 }}>Xin chào, {user?.name}!</Typography.Title>
        <Typography.Text style={{ color: '#6b7280' }}>Tổng quan hoạt động giao hàng của bạn</Typography.Text>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {statCards.map((card, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card bordered={false} style={{ borderRadius: 12, background: card.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Typography.Text style={{ color: '#6b7280', fontSize: 13 }}>{card.title}</Typography.Text>
                      <Statistic
                        value={card.value}
                        valueStyle={{ color: card.color, fontSize: 28, fontWeight: 700 }}
                        formatter={(value) => card.isCurrency ? `${Number(value).toLocaleString('vi-VN')} ₫` : Number(value).toLocaleString()}
                      />
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff' }}>
                      {card.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={8}>
              <Card title={<Typography.Text strong>Tỷ lệ giao hàng</Typography.Text>} bordered={false} style={{ borderRadius: 12, height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Progress
                    type="circle"
                    percent={successRate}
                    strokeColor="#10b981"
                    format={(percent) => <span style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{percent}%</span>}
                    size={140}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
                  <Tag color="green">Thành công: {stats.delivered}</Tag>
                  <Tag color="blue">Đang giao: {stats.shipping}</Tag>
                  <Tag color="red">Thất bại: {stats.failed}</Tag>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              <Card title={<Typography.Text strong>Phân bổ trạng thái</Typography.Text>} bordered={false} style={{ borderRadius: 12, height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
                  {[
                    { label: 'Đã giao thành công', value: stats.delivered, color: '#10b981', total: stats.total },
                    { label: 'Đang giao', value: stats.shipping, color: '#3b82f6', total: stats.total },
                    { label: 'Đã hủy / Thất bại', value: stats.failed, color: '#ef4444', total: stats.total },
                  ].map((item) => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Typography.Text>{item.label}</Typography.Text>
                        <Typography.Text strong>{item.value}</Typography.Text>
                      </div>
                      <Progress
                        percent={item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}
                        strokeColor={item.color}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <Card
                title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrophyOutlined style={{ color: '#f59e0b' }} /><Typography.Text strong>Đơn hàng gần đây</Typography.Text></div>}
                bordered={false}
                style={{ borderRadius: 12 }}
              >
                <List
                  dataSource={recentOrders}
                  locale={{ emptyText: 'Chưa có đơn hàng nào' }}
                  renderItem={(order: any) => {
                    const statusCfg = STATUS_CONFIG[order.status] || { color: '#9ca3af', label: order.status, icon: null };
                    return (
                      <List.Item extra={<Typography.Text strong style={{ color: '#ef4444' }}>{order.totalPrice?.toLocaleString('vi-VN')} ₫</Typography.Text>}>
                        <List.Item.Meta
                          avatar={
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: statusCfg.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusCfg.color, fontSize: 18 }}>
                              {statusCfg.icon}
                            </div>
                          }
                          title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>Đơn #{order.id}</span><Tag color={statusCfg.color} style={{ margin: 0 }}>{statusCfg.label}</Tag></div>}
                          description={<span style={{ color: '#6b7280' }}>{order.shippingName} - {order.shippingAddress?.slice(0, 50)}...<br /><span style={{ fontSize: 12 }}>{dayjs(order.createdAt).format('HH:mm DD/MM/YYYY')}</span></span>}
                        />
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Typography.Text style={{ color: '#9ca3af', fontSize: 12 }}>Cập nhật: {dayjs().format('HH:mm DD/MM/YYYY')}</Typography.Text>
          </div>
        </>
      )}
    </div>
  );
};

export default ShipperDashboardPage;
