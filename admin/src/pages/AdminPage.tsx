import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Spin } from 'antd';
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  
  // Lấy key từ URL để highlight menu
  const pathname = location.pathname;
  const selectedKey = pathname.split('/').slice(2).join('/') || 'dashboard';


  const handleLogout = async () => {
    try {
      // Gọi API đăng xuất để xóa cookie
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
    }
  };

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogout();
      return;
    }
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;