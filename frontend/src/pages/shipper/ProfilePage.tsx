import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, notification } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/user/userService';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ShipperProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, form]);

  const onFinish = async (values: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    try {
      await UserService.updateProfile(values);
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật thông tin thành công',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Cập nhật thông tin thất bại',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  return (
    <Card title="Hồ sơ của tôi">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ShipperProfilePage; 