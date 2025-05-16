import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/order/orderService';
import { ShippingAddressService } from '../services/shipping/shippingAddressService';
import { PaymentService } from '../services/order/paymentService';
import { formatPrice } from '../utils/format';
import VNPayPayment from '../components/payment/VNPayPayment';
import { Order, PaymentMethod, PaymentStatus } from '../types';
import { message, Form, Input, Select, Button, Radio, Spin, Checkbox, Modal } from 'antd';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isAddressListVisible, setIsAddressListVisible] = useState(false);
  const [editIsDefault, setEditIsDefault] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const fetchAddresses = async () => {
    try {
      const addresses = await ShippingAddressService.getShippingAddresses();
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate, form]);

  const handleTimeout = () => {
    setError('Phiên thanh toán đã hết hạn. Vui lòng thử lại.');
    setPaymentUrl(null);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
  
    try {
      if (!isAuthenticated || !user) {
        setError('Vui lòng đăng nhập để thanh toán');
        navigate('/login');
        return;
      }
  
      // Validate cart
      if (!cart.items.length) {
        setError('Giỏ hàng trống');
        setLoading(false);
        return;
      }

      // Lấy thông tin địa chỉ từ địa chỉ mặc định nếu có
      const defaultAddress = shippingAddresses.find((addr: any) => addr.isDefault);
      const shippingInfo = defaultAddress ? {
        name: defaultAddress.name,
        phone: defaultAddress.phone,
        address: defaultAddress.address,
        id: defaultAddress.id
      } : {
        name: values.name,
        phone: values.phone,
        address: values.address
      };

      // Chỉ tạo địa chỉ mới khi không có địa chỉ mặc định và người dùng muốn lưu địa chỉ
      if (values.saveAddress && !defaultAddress) {
        try {
          const newAddress = await ShippingAddressService.createShippingAddress({
            name: values.name,
            phone: values.phone,
            address: values.address,
            isDefault: shippingAddresses.length === 0
          });
          shippingInfo.id = newAddress.id;
        } catch (error) {
          console.error('Failed to save shipping address:', error);
        }
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
        shippingAddress: shippingInfo.address,
        shippingPhone: shippingInfo.phone,
        shippingName: shippingInfo.name,
        note: values.note,
        paymentMethod: values.paymentMethod,
        userId: user.id,
        shippingAddressId: shippingInfo.id || selectedAddress
      };
  
      console.log('Creating order with data:', orderData);
  
      // Tạo đơn hàng
      const data = await OrderService.createOrder(orderData);
      console.log('Order created:', data);
  
      // Kiểm tra phản hồi từ backend
      if (!data || !data.order) {
        throw new Error('Không thể tạo đơn hàng');
      }
  
      // Nếu là COD, điều hướng đến trang chi tiết đơn hàng
      if (values.paymentMethod === PaymentMethod.COD) {
        clearCart();
        navigate(`/user/orders/${data.order.id}`);
      } else if (values.paymentMethod === PaymentMethod.VN_PAY) {
        // Xử lý thanh toán VNPay
        const paymentData = await PaymentService.createPaymentUrl(data.order.id);
        if (paymentData.paymentUrl) {
          setPaymentUrl(paymentData.paymentUrl);
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

  const handleEditAddress = () => {
    setIsAddressListVisible(true);
  };

  const handleSaveAddress = async (values: any) => {
    // Kiểm tra địa chỉ trùng lặp, loại trừ địa chỉ đang chỉnh sửa
    const isDuplicate = shippingAddresses.some(
      (addr) =>
        addr.id !== editingAddress?.id && // Loại trừ địa chỉ đang chỉnh sửa
        addr.name === values.name &&
        addr.phone === values.phone &&
        addr.address === values.address
    );

    if (isDuplicate) {
      message.warning('Địa chỉ này đã tồn tại trong hệ thống');
      return;
    }
  
    try {
      if (editingAddress) {
        // Cập nhật địa chỉ hiện có
        await ShippingAddressService.updateShippingAddress(editingAddress.id, {
          name: values.name,
          phone: values.phone,
          address: values.address,
          isDefault: editIsDefault,
        });
        message.success('Cập nhật địa chỉ thành công');
      } else {
        // Tạo địa chỉ mới
        await ShippingAddressService.createShippingAddress({
          name: values.name,
          phone: values.phone,
          address: values.address,
          isDefault: editIsDefault,
        });
        message.success('Thêm địa chỉ mới thành công');
      }
  
      // Refresh danh sách địa chỉ sau khi cập nhật
      await fetchAddresses();
  
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      message.error('Đã xảy ra lỗi khi lưu địa chỉ');
    } finally {
      setIsModalVisible(false);
      setEditName('');
      setEditPhone('');
      setEditAddress('');
      setEditingAddress(null);
      setEditIsDefault(false);
    }
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
          <h2 className="text-xl font-bold mb-4">Địa chỉ nhận hàng</h2>

          {shippingAddresses.filter(addr => addr.isDefault).map(defaultAddress => (
            <div
              className="flex justify-between items-start p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4"
              key={defaultAddress.id}
            >
              <div className="space-y-1">
                <p className="font-semibold">{defaultAddress.name}</p>
                <p className="text-gray-600">{defaultAddress.phone}</p>
                <p className="text-gray-600">{defaultAddress.address}</p>
              </div>
              <Button type="link" onClick={handleEditAddress} className="text-blue-600">
                Chỉnh sửa
              </Button>
            </div>
          ))}

          {/* Địa chỉ của tôi */}
          <Modal
            title="Địa chỉ của tôi"
            open={isAddressListVisible}
            onCancel={() => {
              setIsAddressListVisible(false);
              setIsModalVisible(false);
            }}
            footer={null}
          >
            {shippingAddresses.map((address) => (
              <div
                key={address.id}
                className="flex justify-between items-start p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-600">{address.address}</p>
                </div>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingAddress(address);
                    setEditName(address.name);
                    setEditPhone(address.phone);
                    setEditAddress(address.address);
                    setEditIsDefault(address.isDefault);
                    setIsAddressListVisible(false);
                    setIsModalVisible(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            ))}

            <Button
              type="primary"
              onClick={() => {
                setEditingAddress(null);
                setEditName('');
                setEditPhone('');
                setEditAddress('');
                setIsAddressListVisible(false);
                setIsModalVisible(true);
              }}
              block
            >
              Thêm địa chỉ mới
            </Button>
          </Modal>

          {/* Sửa địa chỉ */}
          <Modal
            title="Sửa địa chỉ"
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditName('');
              setEditPhone('');
              setEditAddress('');
            }}
            footer={null}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveAddress({
                  name: editName,
                  phone: editPhone,
                  address: editAddress,
                });
              }}
            >
              <div className="mb-4">
                <label className="block font-medium mb-1">Họ tên</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Số điện thoại</label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Địa chỉ</label>
                <Input.TextArea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
              </div>

              <div className="mb-4">
                <Checkbox checked={editIsDefault} onChange={(e) => setEditIsDefault(e.target.checked)}>
                  Đặt làm địa chỉ mặc định
                </Checkbox>
              </div>

              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </form>
          </Modal>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
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