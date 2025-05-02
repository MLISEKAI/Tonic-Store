import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, createPaymentUrl, getShippingAddresses } from '../services/api';
import { formatPrice } from '../utils/format';
import VNPayPayment from '../components/VNPayPayment';
import { Order, PaymentMethod, PaymentStatus } from '../types';
import { message, Form, Input, Select, Button, Radio, Spin } from 'antd';

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const addresses = await getShippingAddresses(token);
        setShippingAddresses(addresses);
        const defaultAddress = addresses.find((addr: any) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
          form.setFieldsValue({
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address: defaultAddress.address
          });
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        if (error instanceof Error && error.message.includes('401')) {
          navigate('/login');
        }
      }
    };

    fetchAddresses();
  }, [token, navigate, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
  
    try {
      if (!token || !user) {
        setError('Vui lòng đăng nhập để thanh toán');
        navigate('/login');
        return;
      }
  
      // Validate form data
      if (!values.name || !values.phone || !values.address) {
        setError('Vui lòng điền đầy đủ Thông tin nhận hàng');
        setLoading(false);
        return;
      }
  
      // Validate cart
      if (!cart.items.length) {
        setError('Giỏ hàng trống');
        setLoading(false);
        return;
      }
  
      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: parseFloat(item.product.price.toString().replace(',', '.'))
        })),
        totalPrice: cart.items.reduce((sum, item) => 
          sum + parseFloat(item.product.price.toString().replace(',', '.')) * item.quantity, 
          0
        ),
        shippingAddress: values.address,
        shippingPhone: values.phone,
        shippingName: values.name,
        note: values.note,
        paymentMethod: values.paymentMethod,
        userId: user.id,
        shippingAddressId: selectedAddress
      };
  
      console.log('Creating order with data:', orderData);
  
      // Gửi yêu cầu tạo đơn hàng
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
  
      // Kiểm tra phản hồi từ backend
      if (!response.ok) {
        throw new Error('Không thể tạo đơn hàng');
      }
  
      const data = await response.json();
      console.log('Order created:', data);
  
      // Kiểm tra phản hồi từ backend
      if (!data || !data.order) {
        throw new Error('Không thể tạo đơn hàng');
      }
  
      // Nếu là COD, điều hướng đến trang chi tiết đơn hàng
      if (values.paymentMethod === PaymentMethod.COD) {
        clearCart();
        navigate(`/orders/${data.order.id}`);
      } else if (values.paymentMethod === PaymentMethod.VN_PAY) {
        // Xử lý thanh toán VNPay
        if (data.paymentUrl) {
          setPaymentUrl(data.paymentUrl);
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = () => {
    setError('Phiên thanh toán đã hết hạn. Vui lòng thử lại.');
    setPaymentUrl(null);
  };

  if (paymentUrl) {
    return <VNPayPayment paymentUrl={paymentUrl} onTimeout={handleTimeout} />;
  }

  if (!cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              paymentMethod: PaymentMethod.VN_PAY
            }}
          >
            {shippingAddresses.length > 0 && (
              <Form.Item label="Chọn địa chỉ giao hàng">
                <Select
                  value={selectedAddress}
                  onChange={(value) => {
                    setSelectedAddress(value);
                    const address = shippingAddresses.find(addr => addr.id === value);
                    if (address) {
                      form.setFieldsValue({
                        name: address.name,
                        phone: address.phone,
                        address: address.address
                      });
                    }
                  }}
                >
                  {shippingAddresses.map((address) => (
                    <Select.Option key={address.id} value={address.id}>
                      {address.name} - {address.address} {address.isDefault ? '(Mặc định)' : ''}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="note"
              label="Ghi chú"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
              <Radio.Group>
                <Radio value={PaymentMethod.COD}>Thanh toán khi nhận hàng</Radio>
                <Radio value={PaymentMethod.VN_PAY}>VNPay</Radio>
                <Radio value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</Radio>
              </Radio.Group>
            </Form.Item>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                Đặt hàng
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-indigo-600 font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-indigo-600">
                  {formatPrice(cart.items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 