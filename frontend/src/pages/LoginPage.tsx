import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectByRole = (role: string) => {
    if (role === 'ADMIN') {
      const adminUrl = import.meta.env.VITE_ADMIN_URL;
      window.open(`${adminUrl}/admin`, '_blank');
    } else if (role === 'DELIVERY') {
      navigate('/shipper/dashboard');
    } else {
      navigate('/');
    }
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const loginData = {
        email: values.email.toLowerCase().trim(),
        password: values.password,
      };
      const response = await login(loginData);
      redirectByRole(response.user.role);
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
    <div className="min-h-screen bg-[#f8f9fb] flex">

      {/* LEFT - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#111827] text-white p-16 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-[#111827] rounded-lg flex items-center justify-center font-bold text-lg">
            T
          </div>
          <span className="font-semibold text-lg">Tonic Store</span>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-4">WELCOME BACK</p>
          <h1 className="text-5xl font-semibold leading-tight">
            Chào mừng bạn<br />quay trở lại.
          </h1>
          <p className="mt-6 text-gray-400 max-w-md leading-7">
            Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng của bạn.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Tonic Store
        </p>
      </div>

      {/* RIGHT - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-[420px] animate-page-slide-in">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111827] text-white rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-semibold text-lg">Tonic Store</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-900">Đăng nhập</h2>
            <p className="text-gray-500 mt-3">Vui lòng nhập thông tin để tiếp tục.</p>
          </div>

          {/* Form */}
          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            requiredMark={false}
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
                placeholder="name@example.com"
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                className="h-12 rounded-md"
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
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
                className="h-12 rounded-md"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-[#111827]">
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item>
              <Button
                htmlType="submit"
                className="login-btn w-full h-12 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                Đăng nhập
                <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#111827] font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
