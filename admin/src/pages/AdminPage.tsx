import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge } from 'antd';
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
  LineChartOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const pathname = location.pathname;
  const selectedKey = pathname.split('/').slice(2).join('/') || 'dashboard';

  const handleLogout = async () => {
    try { await logout(); } catch { window.location.href = '/admin/login'; }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Bảng điều khiển' },
    { type: 'divider', className: 'menu-section-divider' },
    { key: 'products', icon: <ShoppingOutlined />, label: 'Sản phẩm', children: [
      { key: 'product-list', label: 'Tất cả sản phẩm' },
      { key: 'product-categories', label: 'Danh mục' },
    ]},
    { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
    { key: 'discount-codes', icon: <GiftOutlined />, label: 'Mã giảm giá' },
    { type: 'divider', className: 'menu-section-divider' },
    { key: 'users', icon: <UserOutlined />, label: 'Người dùng', children: [
      { key: 'user-list', label: 'Tất cả người dùng' },
      { key: 'shippers', label: 'Nhân viên giao hàng' },
    ]},
    { key: 'shipping', icon: <CarOutlined />, label: 'Địa chỉ giao hàng' },
    { key: 'reviews', icon: <CommentOutlined />, label: 'Đánh giá' },
    { key: 'logs', icon: <LineChartOutlined />, label: 'API Logs' },
  ];

  const userMenuItems: MenuProps['items'] = [
    { key: 'info', label: (
      <div style={{ padding: '4px 0' }}>
        <div style={{ fontWeight: 600 }}>{(user as any)?.name || 'Admin'}</div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>{user?.email}</div>
      </div>
    ), disabled: true },
    { type: 'divider' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { key: 'logout', icon: <LogoutOutlined style={{ color: '#ef4444' }} />, label: <span style={{ color: '#ef4444' }}>Đăng xuất</span> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={72}
        className="admin-sider"
      >
        <div className="admin-sider-logo">
          <div className="admin-sider-logo-icon">
            {collapsed ? 'A' : 'ADM'}
          </div>
          {!collapsed && <span className="admin-sider-logo-text">Tonic Store</span>}
        </div>

        <div className="admin-sider-menu">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['products', 'users']}
            items={menuItems}
            onClick={({ key }: { key: string }) => navigate(`/admin/${key}`)}
            className="admin-sidebar-menu"
          />
        </div>

        <div className="admin-sider-footer">
          <div className="admin-sider-logout" onClick={handleLogout}>
            <LogoutOutlined />
            {!collapsed && <span>Đăng xuất</span>}
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 72 : 260, transition: 'margin-left 0.2s' }}>
        <Header className="admin-header">
          <div className="admin-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="admin-header-toggle"
            />
          </div>
          <div className="admin-header-right">
            <Badge count={3} size="small" offset={[-2, 2]}>
              <div className="admin-header-icon-btn"><BellOutlined /></div>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="admin-header-user">
                <Avatar size={34} className="admin-header-avatar">
                  {user?.email?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                <div className="admin-header-user-info">
                  <div className="admin-header-user-name">{(user as any)?.name || 'Admin'}</div>
                  <div className="admin-header-user-role">Quản trị viên</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
