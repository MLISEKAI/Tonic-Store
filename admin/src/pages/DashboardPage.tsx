import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Tag } from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import {
  ShoppingOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { StatsData } from '../types/stats';
import { fetchWithCredentials, handleResponse } from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Chờ xác nhận' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PROCESSING: { color: 'cyan', label: 'Đang xử lý' },
  SHIPPED: { color: 'purple', label: 'Đang giao' },
  DELIVERED: { color: 'green', label: 'Đã giao' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithCredentials(`${API_URL}/api/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await handleResponse(response);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Spin size="large" tip="Đang tải thống kê..." />
      </div>
    );
  }

  if (!stats) {
    return <Typography.Text type="danger">Lỗi tải thống kê</Typography.Text>;
  }

  const ordersByStatus = (stats.ordersByStatus ?? []).map((s: any) => ({
    name: STATUS_MAP[s.status]?.label ?? s.status,
    value: s._count?.status ?? 0,
    status: s.status,
  }));

  const topProducts = (stats.topProducts ?? []).slice(0, 8).map((p: any) => ({
    name: p.name?.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    fullName: p.name,
    value: p.value ?? p.soldCount ?? 0,
  }));

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts ?? 0,
      icon: <ShoppingOutlined />,
      color: '#10b981',
      bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    },
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers ?? 0,
      icon: <UserOutlined />,
      color: '#3b82f6',
      bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders ?? 0,
      icon: <ShoppingCartOutlined />,
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    },
    {
      title: 'Tổng doanh thu',
      value: stats.totalRevenue ?? 0,
      icon: <DollarOutlined />,
      color: '#ef4444',
      bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      isCurrency: true,
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Tổng quan
      </Typography.Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                background: card.bg,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography.Text style={{ color: '#6b7280', fontSize: 13 }}>{card.title}</Typography.Text>
                  <Statistic
                    value={card.isCurrency ? card.value : card.value}
                    valueStyle={{ color: card.color, fontSize: 28, fontWeight: 700 }}
                    suffix={card.isCurrency ? '₫' : undefined}
                    formatter={(value) =>
                      card.isCurrency
                        ? Number(value).toLocaleString('vi-VN')
                        : Number(value).toLocaleString()
                    }
                  />
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#fff',
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Orders by Status - Donut */}
        <Col xs={24} lg={8}>
          <Card
            title={<Typography.Text strong>Phân bổ đơn hàng</Typography.Text>}
            bordered={false}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {ordersByStatus.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} đơn`, name]}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
              {ordersByStatus.map((item: any, index: number) => (
                <Tag key={item.status} color={COLORS[index % COLORS.length]} style={{ margin: 0 }}>
                  {item.name}: {item.value}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>

        {/* Top Products - Bar */}
        <Col xs={24} lg={16}>
          <Card
            title={<Typography.Text strong>Sản phẩm bán chạy</Typography.Text>}
            bordered={false}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topProducts} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  formatter={(value: any, _name: any, props: any) => [`${value} đã bán`, props.payload.fullName]}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {topProducts.map((_: any, index: number) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Revenue Area Chart (mock if available) */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiseOutlined style={{ color: '#10b981' }} />
                <Typography.Text strong>Thống kê doanh thu</Typography.Text>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={[
                { month: 'T1', revenue: 12000000 },
                { month: 'T2', revenue: 19000000 },
                { month: 'T3', revenue: 15000000 },
                { month: 'T4', revenue: 25000000 },
                { month: 'T5', revenue: 22000000 },
                { month: 'T6', revenue: 30000000 },
                { month: 'T7', revenue: 28000000 },
                { month: 'T8', revenue: 35000000 },
                { month: 'T9', revenue: 32000000 },
                { month: 'T10', revenue: 40000000 },
                { month: 'T11', revenue: 38000000 },
                { month: 'T12', revenue: 45000000 },
              ]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
