import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

interface ShipperLayoutProps {
  children: React.ReactNode;
}

const ShipperLayout: React.FC<ShipperLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/shipper/dashboard">Dashboard</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link to="/shipper/orders">Quản lý đơn hàng</Link>,
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: <Link to="/shipper/history">Lịch sử đơn hàng</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/shipper/profile">Hồ sơ</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span onClick={() => logout()}>Đăng xuất</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-600">Shipper Dashboard</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/')[2] || 'orders']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Xin chào, {user?.name}</h2>
        </Header>
        <Content className="p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShipperLayout; 