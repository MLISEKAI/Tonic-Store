import { FC, useState } from 'react';
import { Form, Input, Button, notification, Row, Col, Card } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import { ContactService } from '../services/contact/contactService';

const { TextArea } = Input;

const ContactPage: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Gửi thông tin liên hệ đến server
      await ContactService.sendMessage(values);
      notification.success({
        message: 'Thành công',
        description: 'Gửi thông tin liên hệ thành công!',
        placement: 'topRight',
        duration: 2,
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi thông tin liên hệ',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Liên hệ với chúng tôi</h1>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card className="h-full">
            <h2 className="text-xl font-semibold mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <EnvironmentOutlined className="text-2xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <PhoneOutlined className="text-2xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Điện thoại</h3>
                  <p className="text-gray-600">+84 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MailOutlined className="text-2xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">contact@tonicstore.com</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <h2 className="text-xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập số điện thoại của bạn" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn' }]}
              >
                <TextArea rows={4} placeholder="Nhập nội dung tin nhắn của bạn" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  className="w-full"
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage; 