import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, notification, Typography, Avatar, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/user/userService';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface ExtendedUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const ShipperProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const extendedUser = user as ExtendedUser;
      form.setFieldsValue({
        fullName: extendedUser.name,
        email: extendedUser.email,
        phone: extendedUser.phone || '',
        address: extendedUser.address || '',
      });
    }
  }, [user, form]);

  const onFinish = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      await UserService.updateProfile(values);
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật thông tin thành công',
        placement: 'topRight',
        duration: 2,
      });
    } catch {
      notification.error({
        message: 'Lỗi',
        description: 'Cập nhật thông tin thất bại',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Hồ sơ cá nhân
      </Typography.Title>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Avatar
              size={80}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                fontSize: 36,
                marginBottom: 16,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </Avatar>
            <Typography.Title level={5} style={{ marginBottom: 4 }}>{user?.name}</Typography.Title>
            <Typography.Text style={{ color: '#6b7280' }}>{user?.email}</Typography.Text>
            <Divider />
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Typography.Text style={{ color: '#6b7280' }}>Vai trò</Typography.Text>
                <Typography.Text strong>Shipper</Typography.Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography.Text style={{ color: '#6b7280' }}>Trạng thái</Typography.Text>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Hoạt động</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={<Typography.Text strong>Chỉnh sửa thông tin</Typography.Text>}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="0912 345 678" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  >
                    <Input prefix={<HomeOutlined />} placeholder="123 Đường ABC, Quận 1" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{ height: 44, borderRadius: 8 }}
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShipperProfilePage;
