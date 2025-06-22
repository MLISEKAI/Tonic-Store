import { Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const onFinish = async (values: { password: string; confirm: string }) => {
    if (!token) {
      notification.error({
        message: 'Lỗi',
        description: 'Token không hợp lệ hoặc đã hết hạn!',
        placement: 'topRight',
        duration: 2,
      });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      notification.success({
        message: 'Thành công',
        description: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.',
        placement: 'topRight',
        duration: 2,
      });
      navigate('/login');
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
          <h2 className="text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
          <p className="mt-2 text-sm text-gray-500">Nhập mật khẩu mới của bạn</p>
        </div>
        <Form name="reset_password" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới"
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Xác nhận mật khẩu mới"
              prefix={<LockOutlined className="text-gray-400" />}
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
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 