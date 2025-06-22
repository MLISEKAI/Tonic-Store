import { Form, Input, Button, Card, notification } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { forgotPassword } from '../services/api';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      notification.success({
        message: 'Thành công',
        description: 'Vui lòng kiểm tra email để đặt lại mật khẩu.',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error: any) {
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Có lỗi xảy ra!',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h2>
          <p className="mt-2 text-sm text-gray-500">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>
        <Form name="forgot_password" layout="vertical" onFinish={onFinish}>
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
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              Gửi email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
