import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

interface ShipperLayoutProps {
  children: React.ReactNode;
}

const ShipperLayout: React.FC<ShipperLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'orders', icon: <ShoppingOutlined />, label: 'Đơn hàng đang giao' },
    { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử giao hàng' },
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
  ];

  const handleLogout = async () => {
    try { await logout(); } catch { window.location.href = '/'; }
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'info', label: (
      <div style={{ padding: '4px 0' }}>
        <div style={{ fontWeight: 600 }}>{user?.name}</div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>Shipper</div>
      </div>
    ), disabled: true },
    { type: 'divider' },
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ', onClick: () => navigate('/shipper/profile') },
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
          <div className="admin-sider-logo-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
            {collapsed ? 'S' : 'Ship'}
          </div>
          {!collapsed && <span className="admin-sider-logo-text">Tonic Store</span>}
        </div>

        <div className="admin-sider-menu">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.split('/')[2] || 'orders']}
            items={menuItems}
            onClick={({ key }: { key: string }) => navigate(`/shipper/${key}`)}
            className="admin-sidebar-menu shipper-sidebar-menu"
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
            <div
              onClick={() => setCollapsed(!collapsed)}
              className="admin-header-toggle"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <span style={{ fontSize: 14, color: '#6b7280', marginLeft: 8 }}>
              Xin chào, <strong style={{ color: '#1f2937' }}>{user?.name || 'Shipper'}</strong>
            </span>
          </div>
          <div className="admin-header-right">
            <div className="admin-header-icon-btn" style={{ position: 'relative' }}>
              <BellOutlined />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="admin-header-user">
                <Avatar size={34} style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </Avatar>
                <div className="admin-header-user-info">
                  <div className="admin-header-user-name">{user?.name}</div>
                  <div className="admin-header-user-role">Shipper</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShipperLayout;
