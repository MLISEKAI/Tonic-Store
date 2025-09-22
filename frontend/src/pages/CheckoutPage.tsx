import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/order/orderService';
import { ShippingAddressService } from '../services/shipping/shippingAddressService';
import { PaymentService } from '../services/order/paymentService';
import { PaymentMethod } from '../types';
import { formatPrice } from '../utils/format';
import VNPayPayment from '../components/payment/VNPayPayment';
import PromotionCodeInput, { PromotionCodeInputRef } from '../components/checkout/PromotionCodeInput';
import { message, Form, Input, Button, Radio, Checkbox, Modal } from 'antd';

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [isAddressListVisible, setIsAddressListVisible] = useState(false);
  const [editIsDefault, setEditIsDefault] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [bankTransferModalVisible, setBankTransferModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const promotionCodeRef = useRef<PromotionCodeInputRef>(null);
  const [appliedPromotionCode, setAppliedPromotionCode] = useState<string | null>(null);

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
        navigate('/');
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
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
        navigate('/');
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
      const cartTotal = cart.items.reduce((sum, item) => 
        sum + parseFloat(item.price.toString().replace(',', '.')) * item.quantity, 
        0
      );

      const orderData = {
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: parseFloat(item.price.toString().replace(',', '.'))
        })),
        totalPrice: finalPrice || cartTotal,
        originalPrice: cartTotal,
        discount: discount,
        shippingAddress: shippingInfo.address,
        shippingPhone: shippingInfo.phone,
        shippingName: shippingInfo.name,
        note: values.note,
        paymentMethod: values.paymentMethod,
        userId: user.id,
        shippingAddressId: shippingInfo.id || selectedAddress,
        promotionCode: appliedPromotionCode
      };

      // Tạo đơn hàng
      const data = await OrderService.createOrder(orderData);
  
      // Kiểm tra phản hồi từ backend
      if (!data || !data.order) {
        throw new Error('Không thể tạo đơn hàng');
      }

      // Xóa mã giảm giá sau khi đặt hàng thành công
      if (promotionCodeRef.current) {
        promotionCodeRef.current.clearAppliedCode();
      }

      // Xử lý theo phương thức thanh toán
      if (values.paymentMethod === PaymentMethod.COD) {
        clearCart();
        navigate(`/user/orders/${data.order.id}`);
      } else if (values.paymentMethod === PaymentMethod.VN_PAY) {
        const paymentData = await PaymentService.createPaymentUrl(data.order.id);
        if (paymentData.paymentUrl) {
          setPaymentUrl(paymentData.paymentUrl);
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      } else if (values.paymentMethod === PaymentMethod.BANK_TRANSFER) {
        setCurrentOrder(data.order);
        setBankTransferModalVisible(true);
        clearCart();
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

  const handleSelectAddress = async (id: number) => {
    try {
      await ShippingAddressService.setDefaultShippingAddress(id);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      message.error("Không thể chọn địa chỉ");
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
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
              onClick={() => handleSelectAddress(address.id)}
              className={`flex justify-between items-start p-4 rounded-lg shadow-md border mb-4 cursor-pointer transition 
                ${address.isDefault ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'}`}
            >
              <div className="space-y-1">
                <p className="font-semibold">{address.name}</p>
                <p className="text-gray-600">{address.phone}</p>
                <p className="text-gray-600">{address.address}</p>
                {address.isDefault && <span className="text-sm text-blue-600 font-medium">[Địa chỉ mặc định]</span>}
              </div>
                <Button
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
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

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Đơn hàng của bạn</h2>
            
            <PromotionCodeInput
              ref={promotionCodeRef}
              orderValue={cart.items.reduce((sum, item) => 
                sum + parseFloat(item.price.toString().replace(',', '.')) * item.quantity, 
                0
              )}
              onDiscountApplied={(discount, final, code) => {
                setDiscount(discount);
                setFinalPrice(final);
                setAppliedPromotionCode(code || null);
              }}
            />

            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span>{formatPrice(finalPrice || cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Transfer Modal */}
      <Modal
        title="Thông tin chuyển khoản"
        open={bankTransferModalVisible}
        onCancel={() => {
          setBankTransferModalVisible(false);
          navigate(`/user/orders/${currentOrder?.id}`);
        }}
        footer={[
          <Button
            key="viewOrder"
            type="primary"
            onClick={() => {
              setBankTransferModalVisible(false);
              navigate(`/user/orders/${currentOrder?.id}`);
            }}
          >
            Xem chi tiết đơn hàng
          </Button>
        ]}
      >
        <div className="p-4">
          <p className="mb-4">Vui lòng chuyển khoản theo thông tin bên dưới để hoàn tất đơn hàng:</p>

          <div className="space-y-2">
            <p><strong>Ngân hàng:</strong> Vietcombank</p>
            <p><strong>Số tài khoản:</strong> 0123456789</p>
            <p><strong>Chủ tài khoản:</strong> CÔNG TY ABC</p>
            <p><strong>Số tiền:</strong> {formatPrice(currentOrder?.totalPrice)}</p>
            <p><strong>Nội dung chuyển khoản:</strong> THANH TOAN DH#{currentOrder?.id}</p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              Sau khi chuyển khoản, vui lòng gửi biên lai về Zalo 098xxxx hoặc email: support@abc.vn để được xác nhận sớm nhất.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage; 