import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, List, Tag, Modal, Form, Select, Upload, message } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  UserOutlined,
  FileTextOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CameraOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MediaContactPage: React.FC = () => {
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [form] = Form.useForm();

  const mediaContacts = [
    {
      name: 'Nguyễn Thị A',
      position: 'Trưởng phòng Truyền thông',
      email: 'media@tonicstore.com',
      phone: '0901 234 567',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businesswoman_136595-1234.jpg',
    },
    {
      name: 'Trần Văn B',
      position: 'Chuyên viên PR',
      email: 'pr@tonicstore.com',
      phone: '0901 234 568',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businessman_136595-5678.jpg',
    },
    {
      name: 'Lê Thị C',
      position: 'Chuyên viên Marketing',
      email: 'marketing@tonicstore.com',
      phone: '0901 234 569',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businesswoman_136595-9012.jpg',
    },
  ];

  const pressReleases = [
    {
      title: 'Tonic Store ra mắt bộ sưu tập thời trang mùa hè 2024',
      date: '2024-01-15',
      category: 'Thời trang',
      summary: 'Bộ sưu tập mới với thiết kế hiện đại, chất liệu thân thiện môi trường...',
    },
    {
      title: 'Tonic Store đạt mốc 1 triệu khách hàng',
      date: '2024-01-10',
      category: 'Thành tựu',
      summary: 'Cột mốc quan trọng trong hành trình phát triển của thương hiệu...',
    },
    {
      title: 'Tonic Store hợp tác với nhà thiết kế nổi tiếng',
      date: '2024-01-05',
      category: 'Hợp tác',
      summary: 'Sự hợp tác đặc biệt mang đến những sản phẩm độc đáo...',
    },
  ];

  const mediaKits = [
    {
      name: 'Logo Tonic Store',
      description: 'Logo chính thức và các biến thể',
      format: 'PNG, SVG, AI',
      size: '2.5 MB',
    },
    {
      name: 'Hình ảnh sản phẩm',
      description: 'Bộ hình ảnh sản phẩm chất lượng cao',
      format: 'JPG, PNG',
      size: '15.2 MB',
    },
    {
      name: 'Hình ảnh team',
      description: 'Ảnh chân dung đội ngũ lãnh đạo',
      format: 'JPG',
      size: '8.7 MB',
    },
    {
      name: 'Brand Guidelines',
      description: 'Hướng dẫn sử dụng thương hiệu',
      format: 'PDF',
      size: '5.1 MB',
    },
  ];

  const contactReasons = [
    'Phỏng vấn CEO/Founder',
    'Thông tin về sản phẩm mới',
    'Thông tin về sự kiện',
    'Hợp tác truyền thông',
    'Xin tài liệu báo chí',
    'Khác',
  ];

  const handleSubmit = (values: any) => {
    console.log('Media contact form:', values);
    message.success('Yêu cầu đã được gửi! Chúng tôi sẽ liên hệ lại trong vòng 24h.');
    setIsContactModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Liên Hệ Truyền Thông
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Thông tin liên hệ cho báo chí, truyền thông và các đối tác
          </Paragraph>
        </div>

        {/* Contact Team */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Đội Ngũ Truyền Thông</Title>
          <Row gutter={[24, 24]}>
            {mediaContacts.map((contact, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="text-center h-full">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <Title level={4} className="mb-2">{contact.name}</Title>
                  <Text className="text-blue-600 block mb-4">{contact.position}</Text>
                  <Space direction="vertical" size="small">
                    <Space>
                      <MailOutlined />
                      <Text>{contact.email}</Text>
                    </Space>
                    <Space>
                      <PhoneOutlined />
                      <Text>{contact.phone}</Text>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Thông Cáo Báo Chí</Title>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={4} className="mb-2">{release.title}</Title>
                    <Paragraph className="text-gray-600 mb-3">{release.summary}</Paragraph>
                    <Space>
                      <Tag color="blue">{release.category}</Tag>
                      <Text className="text-gray-500">{release.date}</Text>
                    </Space>
                  </div>
                  <Button type="primary" size="small">
                    Xem Chi Tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Kits */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Tài Liệu Truyền Thông</Title>
          <Row gutter={[24, 24]}>
            {mediaKits.map((kit, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">📁</div>
                  <Title level={5} className="mb-2">{kit.name}</Title>
                  <Paragraph className="text-gray-600 mb-3">{kit.description}</Paragraph>
                  <div className="space-y-1">
                    <Text className="text-sm text-gray-500">Format: {kit.format}</Text>
                    <Text className="text-sm text-gray-500">Size: {kit.size}</Text>
                  </div>
                  <Button type="primary" size="small" className="mt-3">
                    Tải Xuống
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Gửi Yêu Cầu Truyền Thông</Title>
          <Card className="max-w-2xl mx-auto">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder="Họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="organization"
                    label="Tổ chức/Báo chí"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức' }]}
                  >
                    <Input placeholder="Tên tổ chức" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="reason"
                label="Lý do liên hệ"
                rules={[{ required: true, message: 'Vui lòng chọn lý do liên hệ' }]}
              >
                <Select placeholder="Chọn lý do liên hệ">
                  {contactReasons.map(reason => (
                    <Option key={reason} value={reason}>
                      {reason}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả chi tiết"
                rules={[
                  { required: true, message: 'Vui lòng mô tả chi tiết' },
                  { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết về yêu cầu của bạn..."
                />
              </Form.Item>

              <Form.Item
                name="attachments"
                label="Tài liệu đính kèm"
                extra="Tải lên tài liệu liên quan (nếu có)"
              >
                <Upload
                  listType="picture-card"
                  maxCount={5}
                  beforeUpload={() => false}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Gửi Yêu Cầu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Quick Contact */}
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Liên Hệ Nhanh
              </Title>
              <Paragraph className="text-blue-700">
                Cần thông tin khẩn cấp? Liên hệ trực tiếp với chúng tôi
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  0901 234 567
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  media@tonicstore.com
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MediaContactPage;
