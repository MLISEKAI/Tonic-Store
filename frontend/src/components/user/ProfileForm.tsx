import { FC } from 'react';
import { Form, Input, Button } from 'antd';
import { UserProfile } from '../../types/user';

interface ProfileFormProps {
  initialValues: UserProfile;
  loading: boolean;
  onSubmit: (values: any) => void;
}

const ProfileForm: FC<ProfileFormProps> = ({ initialValues, loading, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
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