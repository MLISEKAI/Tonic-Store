import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/user/userService';

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
        address: values.address.trim()
      };

      // Đăng ký tài khoản
      const response = await UserService.register(formData);
      
      if (response && response.user) {
        // Đăng ký thành công
        notification.success({
          message: 'Thành công',
          description: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
          placement: 'topRight',
          duration: 3,
        });
        
        // Reset form
        form.resetFields();
        
        // Chuyển hướng đến trang đăng nhập
        navigate('/login');
      } else {
        throw new Error('Không nhận được thông tin người dùng từ server');
      }
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form
            form={form}
            name="register"
            className="login-form"
            onFinish={onFinish}
            validateTrigger="onBlur"
          >
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                { whitespace: true, message: 'Họ tên không được chỉ chứa khoảng trắng!' }
              ]}
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
                { type: 'email', message: 'Email không hợp lệ!' },
                { whitespace: true, message: 'Email không được chứa khoảng trắng!' }
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
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                { whitespace: true, message: 'Mật khẩu không được chứa khoảng trắng!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' },
                { whitespace: true, message: 'Số điện thoại không được chứa khoảng trắng!' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Số điện thoại"
              />
            </Form.Item>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' },
                { whitespace: true, message: 'Địa chỉ không được chỉ chứa khoảng trắng!' }
              ]}
            >
              <Input
                prefix={<HomeOutlined className="site-form-item-icon" />}
                placeholder="Địa chỉ"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button w-full"
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
