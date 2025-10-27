import { FC } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types/user';
import { ShippingAddressService } from '../../services/shipping/shippingAddressService';

interface ProfileFormProps {
  initialValues: UserProfile;
  loading: boolean;
  onSubmit: (values: any) => void;
}

const ProfileForm: FC<ProfileFormProps> = ({ initialValues, loading, onSubmit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      // Cập nhật thông tin người dùng
      await onSubmit(values);

      // Tạo địa chỉ giao hàng mới
      await ShippingAddressService.createShippingAddress({
        name: values.name,
        phone: values.phone,
        address: values.address,
        isDefault: true
      });

      notification.success({
        message: 'Thành công',
        description: 'Đã cập nhật thông tin và địa chỉ giao hàng',
        placement: 'topRight',
        duration: 2,
      });

      // Chuyển hướng đến trang checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
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

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm; 