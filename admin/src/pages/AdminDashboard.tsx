import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Row, Col, Statistic, Avatar, Typography, Spin } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  LogoutOutlined,
  CommentOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement';
import ProductCategories from '../components/ProductCategories';
import UserManagement from '../components/UserManagement';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import OrderList from '../components/OrderList';
import DeliveryAddress from '../components/DeliveryAddress';
import Promotions from '../components/DiscountCode';
import Reviews from '../components/Reviews';
import ShipperList from '../components/ShipperList';
import { StatsData } from '../types/stats';

const { Header, Sider, Content } = Layout;
const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Nhận đường dẫn hiện tại và đặt khóa đã chọn
  const path = location.pathname.split('/').pop() || 'dashboard';
  const [selectedKey, setSelectedKey] = useState(path);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogout();
      return;
    }
    setSelectedKey(key);
    navigate(`/admin/${key}`);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
      children: [
        {
          key: 'product-list',
          label: 'Danh sách sản phẩm',
        },
        {
          key: 'product-categories',
          label: 'Danh mục sản phẩm',
        },
      ],
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: 'shipping',
      icon: <CarOutlined />,
      label: 'Địa chỉ giao hàng',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Người dùng',
      children: [
        {
          key: 'user-list',
          label: 'Danh sách người dùng',
        },
        {
          key: 'shippers',
          label: 'Danh sách người giao hàng',
        },
      ],
    },
    {
      key: 'discount-codes',
      icon: <GiftOutlined />,
      label: 'Mã giảm giá',
    },
    {
      key: 'reviews',
      icon: <CommentOutlined />,
      label: 'Bình luận / Đánh giá',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const Dashboard = () => {
    if (loading) {
      return <Spin size="large" />;
    }

    if (!stats) {
      return <Typography>Lỗi tải thống kê</Typography>;
    }

    const statCards = [
      { title: 'Tổng sản phẩm', value: stats.totalProducts, color: '#4caf50' },
      { title: 'Tổng người dùng', value: stats.totalUsers, color: '#2196f3' },
      { title: 'Tổng đơn hàng', value: stats.totalOrders, color: '#f44336' },
      { title: 'Tổng doanh thu', value: `$${stats.totalRevenue.toFixed(2)}`, color: '#ff9800' },
    ];

    return (
      <div>
        <Row gutter={[16, 16]}>
          {statCards.map((card, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={card.title}
                  value={card.value}
                  valueStyle={{ color: card.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card title="Đơn hàng theo trạng thái">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus.map(status => ({
                      name: status.status,
                      value: status._count.status
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Sản phẩm bán chạy nhất">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topProducts}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#1890ff"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)', 
          display: 'flex', 
          justifyContent: collapsed ? 'center' : 'start', 
          alignItems: 'center',
          paddingLeft: collapsed ? 0 : 16,
        }}>
          <a href="/" style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
            {collapsed ? 'AD' : 'Admin Dashboard'}
          </a>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['products', 'users']}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header>
        <Content style={{ padding: 24, background: '#fff', minHeight: 280 }}>
          {selectedKey === 'dashboard' && <Dashboard />}
          {selectedKey === 'product-list' && <ProductManagement />}
          {selectedKey === 'product-categories' && <ProductCategories />}
          {selectedKey === 'user-list' && <UserManagement />}
          {selectedKey === 'shippers' && <ShipperList />}
          {selectedKey === 'orders' && <OrderList />}
          {selectedKey === 'shipping' && <DeliveryAddress />}
          {selectedKey === 'discount-codes' && <Promotions />}
          {selectedKey === 'reviews' && <Reviews />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;