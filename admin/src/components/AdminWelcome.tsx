import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  ShoppingOutlined, ShoppingCartOutlined, UserOutlined,
  GiftOutlined, CommentOutlined, LineChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const features = [
  {
    title: 'Quản lý sản phẩm',
    desc: 'Thêm, sửa, xóa sản phẩm và danh mục',
    icon: <ShoppingOutlined />,
    color: '#10b981',
    bg: '#ecfdf5',
    path: '/admin/product-list',
  },
  {
    title: 'Quản lý đơn hàng',
    desc: 'Xem và xử lý đơn hàng',
    icon: <ShoppingCartOutlined />,
    color: '#3b82f6',
    bg: '#eff6ff',
    path: '/admin/orders',
  },
  {
    title: 'Quản lý người dùng',
    desc: 'Quản lý tài khoản và phân quyền',
    icon: <UserOutlined />,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    path: '/admin/user-list',
  },
  {
    title: 'Mã giảm giá',
    desc: 'Tạo và quản lý khuyến mãi',
    icon: <GiftOutlined />,
    color: '#f59e0b',
    bg: '#fffbeb',
    path: '/admin/discount-codes',
  },
  {
    title: 'Đánh giá',
    desc: 'Quản lý bình luận và đánh giá',
    icon: <CommentOutlined />,
    color: '#ef4444',
    bg: '#fef2f2',
    path: '/admin/reviews',
  },
  {
    title: 'API Logs',
    desc: 'Giám sát hiệu suất API',
    icon: <LineChartOutlined />,
    color: '#06b6d4',
    bg: '#ecfeff',
    path: '/admin/logs',
  },
];

const AdminWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 36, color: '#fff',
          }}
        >
          ADM
        </div>
        <Title level={3} style={{ marginBottom: 8 }}>Chào mừng đến Tonic Store Admin</Title>
        <Text style={{ color: '#6b7280', fontSize: 15 }}>
          Chọn một功能 năng bên dưới để bắt đầu quản trị
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {features.map((f) => (
          <Col xs={24} sm={12} lg={8} key={f.path}>
            <Card
              hoverable
              bordered={false}
              onClick={() => navigate(f.path)}
              style={{ borderRadius: 12, cursor: 'pointer', height: '100%' }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: f.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: f.color, marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <Title level={5} style={{ marginBottom: 4 }}>{f.title}</Title>
              <Text style={{ color: '#6b7280', fontSize: 13 }}>{f.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminWelcome;
