import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/user/userService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await UserService.register({
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone
      });
      await register(response);
      notification.success({
        message: 'Thành công',
        description: 'Đăng ký thành công',
        placement: 'topRight',
        duration: 2,
      });
      navigate('/login');
    } catch (error) {
      let errorMessage = 'Đăng ký thất bại';
      if (error instanceof Error) {
        if (error.message.includes('user_email_key')) {
          errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
        } else {
          errorMessage = error.message;
        }
      }
      notification.error({
        message: 'Lỗi',
        description: errorMessage,
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Họ tên"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Số điện thoại"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
