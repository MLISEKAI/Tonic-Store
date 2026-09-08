import { Form, Input, Button, notification } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      const email = values.email.toLowerCase().trim();

      await login(email, values.password);

      notification.success({
        message: 'Đăng nhập thành công',
      });

      navigate('/admin');
    } catch (error) {
      notification.error({
        message: 'Đăng nhập thất bại',
        description:
          error instanceof Error
            ? error.message
            : 'Email hoặc mật khẩu không chính xác.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-[#111827] text-white p-16 flex-col justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-[#111827] rounded-lg flex items-center justify-center font-bold text-lg">
            A
          </div>

          <span className="font-semibold text-lg">
            Admin Panel
          </span>
        </div>

        {/* Main */}
        <div>
          <p className="text-sm text-gray-400 mb-4">
            MANAGEMENT SYSTEM
          </p>

          <h1 className="text-5xl font-semibold leading-tight">
            Manage your system
            <br />
            in one place.
          </h1>

          <p className="mt-6 text-gray-400 max-w-md leading-7">
            Quản lý hệ thống, người dùng và dữ liệu
            một cách dễ dàng và hiệu quả.
          </p>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Admin System
        </p>

      </div>


      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">

        <div className="w-full max-w-[420px]">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 flex items-center gap-3">

            <div className="w-10 h-10 bg-[#111827] text-white rounded-lg flex items-center justify-center font-bold">
              A
            </div>

            <span className="font-semibold text-lg">
              Admin Panel
            </span>

          </div>


          {/* Header */}
          <div className="mb-10">

            <h2 className="text-3xl font-semibold text-gray-900">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-3">
              Vui lòng đăng nhập để tiếp tục.
            </p>

          </div>


          {/* Form */}
          <Form
            name="admin_login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },
              ]}
            >

              <Input
                size="large"
                placeholder="name@example.com"
                prefix={
                  <UserOutlined className="text-gray-400 mr-2" />
                }
                className="h-12 rounded-md"
              />

            </Form.Item>


            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >

              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu"
                prefix={
                  <LockOutlined className="text-gray-400 mr-2" />
                }
                className="h-12 rounded-md"
              />

            </Form.Item>


            <Form.Item className="mt-8">

            <Button
              htmlType="submit"
              loading={loading}
              className="admin-login-btn w-full h-12 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200"
            >
  Đăng nhập

  {!loading && <ArrowRightOutlined />}
</Button>

            </Form.Item>

          </Form>


          <p className="text-xs text-gray-400 text-center mt-8">
            Khu vực này chỉ dành cho quản trị viên.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminLoginPage;