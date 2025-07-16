import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const redirectByRole = (role: string) => {
    if (role === 'ADMIN') {
      const adminUrl = import.meta.env.VITE_ADMIN_URL;
      window.open(`${adminUrl}/admin?token=${encodeURIComponent(localStorage.getItem('token') || '')}&role=${encodeURIComponent(role)}`, '_blank');
    } else if (role === 'SHIPPER' || role === 'DELIVERY') {
      window.open('/shipper');
    } else {
      navigate('/');
    }
  };
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      try {
        const userStr = localStorage.getItem('user');
        const role = userStr ? JSON.parse(userStr).role : '';
        redirectByRole(role);
      } catch {}
    }
  }, [loading, isAuthenticated, navigate]);
  
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const loginData = {
        email: values.email.toLowerCase().trim(),
        password: values.password,
      };
      const data = await login(loginData);
      redirectByRole(data.user.role);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đăng nhập thất bại',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="mt-2 text-sm text-gray-500">Vui lòng nhập thông tin để tiếp tục</p>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="flex justify-between text-sm text-gray-600">
            <Link to="/forgot-password" className="hover:text-blue-600">
              Quên mật khẩu?
            </Link>
            <span>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Đăng ký
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
