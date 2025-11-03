import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    try {
      // Chuẩn hóa dữ liệu trước khi gửi
      const formData = {
        name: values.fullName.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        phone: values.phone.trim(),
        address: values.address ? values.address.trim() : ""
      };

      // Đăng ký tài khoản
      await register(formData);

      // Reset form
      form.resetFields();

      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
    } catch (error) {
      let errorMessage = 'Đăng ký thất bại';
      if (error instanceof Error) {
        errorMessage = error.message;
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng nhập thông tin bên dưới để tạo tài khoản
          </p>
        </div>

        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
              { whitespace: true, message: 'Họ tên không được chỉ chứa khoảng trắng!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Họ tên"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { whitespace: true, message: 'Email không được chứa khoảng trắng!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { whitespace: true, message: 'Mật khẩu không được chứa khoảng trắng!' }
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' },
              { whitespace: true, message: 'Số điện thoại không được chứa khoảng trắng!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Số điện thoại"
              prefix={<PhoneOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: false, message: 'Vui lòng nhập địa chỉ!' },
              { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' },
              { whitespace: true, message: 'Địa chỉ không được chỉ chứa khoảng trắng!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Địa chỉ (không bắt buộc)"
              prefix={<HomeOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
