import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const data = await api.getUserProfile(token!);
      setProfile(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Không thể tải thông tin hồ sơ');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await api.updateUserProfile(token!, values);
      message.success('Cập nhật hồ sơ thành công');
      fetchProfile();
    } catch (error) {
      message.error('Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage; 