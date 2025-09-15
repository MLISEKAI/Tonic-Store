import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, message, Select, Space } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  SendOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const categories = [
    'Hỗ trợ đơn hàng',
    'Khiếu nại dịch vụ',
    'Đề xuất cải tiến',
    'Hợp tác kinh doanh',
    'Tuyển dụng',
    'Khác',
  ];

  const handleSubmit = async (values: ContactForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submitted:', values);
      message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Liên Hệ Với Chúng Tôi
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, 
            chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <div className="space-y-6">
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

                  <div className="flex items-start">
                    <ClockCircleOutlined className="text-2xl text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium">Giờ làm việc</h3>
                      <p className="text-gray-600">8:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <Title level={4} className="mb-4">Tại Sao Chọn Chúng Tôi?</Title>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageOutlined className="text-green-500" />
                    <Text>Phản hồi nhanh chóng trong 24h</Text>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageOutlined className="text-green-500" />
                    <Text>Đội ngũ hỗ trợ chuyên nghiệp</Text>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageOutlined className="text-green-500" />
                    <Text>Giải quyết vấn đề hiệu quả</Text>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageOutlined className="text-green-500" />
                    <Text>Hỗ trợ 24/7 qua nhiều kênh</Text>
                  </div>
                </div>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <Title level={4} className="text-blue-800 mb-2">
                    Cần Hỗ Trợ Khẩn Cấp?
                  </Title>
                  <Paragraph className="text-blue-700 mb-4">
                    Gọi hotline để được hỗ trợ ngay lập tức
                  </Paragraph>
                  <Button type="primary" size="large" icon={<PhoneOutlined />}>
                    1900 1234
                  </Button>
                </div>
              </Card>
            </div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card title="Gửi Tin Nhắn" className="h-full">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên' },
                        { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên của bạn" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                      ]}
                    >
                      <Input placeholder="example@email.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ' },
                      ]}
                    >
                      <Input placeholder="0123 456 789" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="category"
                      label="Chủ đề"
                      rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
                    >
                      <Select placeholder="Chọn chủ đề liên hệ">
                        {categories.map(category => (
                          <Option key={category} value={category}>
                            {category}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label="Tiêu đề"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề' },
                    { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề tin nhắn" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung' },
                    { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự' },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SendOutlined />}
                    className="w-full"
                  >
                    Gửi Tin Nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <div className="mt-16">
          <Title level={2} className="text-center mb-8">Câu Hỏi Thường Gặp</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Làm thế nào để theo dõi đơn hàng?</Title>
                <Paragraph>
                  Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi", 
                  hoặc sử dụng mã đơn hàng để tra cứu trên website.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Thời gian giao hàng là bao lâu?</Title>
                <Paragraph>
                  Thời gian giao hàng từ 1-7 ngày tùy thuộc vào địa điểm. TP.HCM và Hà Nội: 1-2 ngày, 
                  các tỉnh thành khác: 3-5 ngày.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Có thể đổi trả hàng không?</Title>
                <Paragraph>
                  Có, bạn có thể đổi trả hàng trong vòng 7 ngày kể từ khi nhận hàng với điều kiện 
                  sản phẩm còn nguyên vẹn và có hóa đơn.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Title level={4}>Phương thức thanh toán nào được hỗ trợ?</Title>
                <Paragraph>
                  Chúng tôi hỗ trợ thanh toán COD, VNPay, chuyển khoản ngân hàng và các ví điện tử phổ biến.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
