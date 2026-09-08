import { Form, Input, Button, notification } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
const RegisterPage = () => {
  const navigate = useNavigate();
  const { sendRegisterCode, verifyRegisterCode, verifyOtpOnly } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!email) {
      notification.error({ message: 'Vui lòng nhập email' });
      return;
    }
    setLoading(true);
    try {
      await sendRegisterCode(email);
      notification.success({ message: 'Mã xác thực đã được gửi đến email của bạn' });
      setCurrentStep(1);
      startCountdown();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể gửi mã xác thực',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      notification.error({ message: 'Vui lòng nhập mã xác thực 6 chữ số' });
      return;
    }
    setLoading(true);
    try {
      await verifyOtpOnly(email, otpCode);
      notification.success({
        message: 'Xác thực email thành công! Thiết lập mật khẩu và hoàn tất thông tin tài khoản.',
        duration: 4,
      });
      setCurrentStep(2);
    } catch (error) {
      notification.error({
        message: 'Mã xác thực không chính xác',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async (values: {
    name: string;
    password: string;
    phone?: string;
  }) => {
    setLoading(true);
    try {
      await verifyRegisterCode({
        email,
        code: otpCode,
        name: values.name,
        password: values.password,
        phone: values.phone || '',
      });
      notification.success({ message: 'Đăng ký thành công!' });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đăng ký thất bại',
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-5xl font-semibold leading-tight">
            Tham gia cùng<br />chúng tôi.
          </h1>
          <p className="mt-6 text-gray-400 max-w-md leading-7">
            Tạo tài khoản để trải nghiệm mua sắm tốt hơn và theo dõi đơn hàng dễ dàng.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Tonic Store
        </p>
      </div>

      {/* RIGHT - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-page-slide-in">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111827] text-white rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-semibold text-lg">Tonic Store</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">Đăng ký</h2>
            <p className="text-gray-500 mt-3">Tạo tài khoản mới để bắt đầu mua sắm.</p>
          </div>

          {/* Step 0: Email */}
          {currentStep === 0 && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  size="large"
                  placeholder="name@example.com"
                  prefix={<MailOutlined className="text-gray-400 mr-2" />}
                  className="h-12 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onPressEnter={handleSendCode}
                />
              </div>
              <Button
                onClick={handleSendCode}
                loading={loading}
                className="login-btn w-full h-12 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                Gửi mã xác thực
                <ArrowRightOutlined />
              </Button>
            </div>
          )}

          {/* Step 1: OTP */}
          {currentStep === 1 && (
            <div className="animate-step space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã xác thực (6 chữ số)</label>
                <Input
                  size="large"
                  placeholder="000000"
                  maxLength={6}
                  className="h-12 rounded-md text-center text-lg tracking-widest"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  onPressEnter={handleVerifyOtp}
                />
              </div>
              <Button
                onClick={handleVerifyOtp}
                loading={loading}
                className="login-btn w-full h-12 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                Xác nhận mã
                <ArrowRightOutlined />
              </Button>

              <div className="text-center p-4">
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  className={`text-sm ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#111827] hover:underline cursor-pointer'}`}
                >
                  {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="text-sm text-gray-500 hover:text-[#111827] cursor-pointer"
              >
                ← Thay đổi email
              </button>
            </div>
          )}

          {/* Step 2: Complete Info */}
          {currentStep === 2 && (
            <div className="animate-step">
              <Form
                name="register_complete"
                layout="vertical"
                onFinish={handleCompleteRegister}
              validateTrigger="onBlur"
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label="Họ tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nguyễn Văn A"
                  prefix={<UserOutlined className="text-gray-400 mr-2" />}
                  className="h-12 rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Tối thiểu 6 ký tự"
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  className="h-12 rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { pattern: /^[0-9]{10,11}$/, message: 'SĐT phải có 10-11 chữ số!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Không bắt buộc"
                  prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                  className="h-12 rounded-md"
                />
              </Form.Item>

              <Form.Item className="mt-6">
                <Button
                  htmlType="submit"
                  loading={loading}
                  className="login-btn w-full h-12 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200"
                >
                  Hoàn tất đăng ký
                  <ArrowRightOutlined />
                </Button>
              </Form.Item>
            </Form>
            </div>
          )}

          {currentStep === 0 && (
            <p className="text-center text-sm text-gray-500 mt-8">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-[#111827] font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
