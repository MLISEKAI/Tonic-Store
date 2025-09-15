import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, List, Tag, Modal, Form, Select, Statistic, Steps } from 'antd';
import { 
  ShareAltOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  LinkOutlined,
  TrophyOutlined,
  TeamOutlined,
  BarChartOutlined,
  GiftOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AffiliatePage: React.FC = () => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [form] = Form.useForm();

  const affiliateSteps = [
    {
      title: 'Đăng Ký',
      description: 'Tạo tài khoản affiliate',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Lấy Link',
      description: 'Tạo link giới thiệu sản phẩm',
      icon: <LinkOutlined />,
    },
    {
      title: 'Chia Sẻ',
      description: 'Chia sẻ link trên mạng xã hội',
      icon: <ShareAltOutlined />,
    },
    {
      title: 'Thu Hoa Hồng',
      description: 'Nhận hoa hồng khi có đơn hàng',
      icon: <DollarOutlined />,
    },
  ];

  const commissionRates = [
    { level: 'Bronze', minSales: 0, rate: '5%', color: 'orange' },
    { level: 'Silver', minSales: 10000000, rate: '7%', color: 'gray' },
    { level: 'Gold', minSales: 50000000, rate: '10%', color: 'gold' },
    { level: 'Platinum', minSales: 100000000, rate: '15%', color: 'blue' },
  ];

  const affiliateBenefits = [
    {
      title: 'Hoa Hồng Cao',
      description: 'Từ 5-15% hoa hồng tùy theo cấp độ',
      icon: '💰',
    },
    {
      title: 'Thanh Toán Nhanh',
      description: 'Thanh toán hàng tháng qua ngân hàng',
      icon: '⚡',
    },
    {
      title: 'Công Cụ Marketing',
      description: 'Banner, link, mã giảm giá cá nhân',
      icon: '📊',
    },
    {
      title: 'Theo Dõi Real-time',
      description: 'Dashboard theo dõi doanh thu chi tiết',
      icon: '📈',
    },
    {
      title: 'Hỗ Trợ Chuyên Nghiệp',
      description: 'Đội ngũ hỗ trợ affiliate 24/7',
      icon: '🛟',
    },
    {
      title: 'Không Rủi Ro',
      description: 'Miễn phí đăng ký, không ràng buộc',
      icon: '🛡️',
    },
  ];

  const successStories = [
    {
      name: 'Blogger Thời Trang',
      earnings: '15 triệu/tháng',
      period: '6 tháng',
      description: 'Chia sẻ về xu hướng thời trang và sản phẩm Tonic Store',
    },
    {
      name: 'YouTuber Tech',
      earnings: '25 triệu/tháng',
      period: '1 năm',
      description: 'Review sản phẩm điện tử và chia sẻ link affiliate',
    },
  ];

  const handleRegister = (values: any) => {
    console.log('Affiliate registration:', values);
    setIsRegisterModalVisible(false);
    form.resetFields();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Tiếp Thị Liên Kết
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Kiếm tiền bằng cách giới thiệu sản phẩm Tonic Store đến bạn bè và khách hàng
          </Paragraph>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
            <Space direction="vertical" size="large">
              <Title level={2} className="text-gray-800">
                Bắt Đầu Kiếm Tiền Ngay Hôm Nay
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Tham gia chương trình affiliate và kiếm hoa hồng từ mỗi đơn hàng bạn giới thiệu
              </Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={() => setIsRegisterModalVisible(true)}
              >
                Đăng Ký Affiliate
              </Button>
            </Space>
          </Card>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Cách Thức Hoạt Động</Title>
          <Steps
            items={affiliateSteps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon,
            }))}
            className="mb-8"
          />
        </div>

        {/* Commission Rates */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Bảng Hoa Hồng Theo Cấp Độ</Title>
          <Row gutter={[16, 16]}>
            {commissionRates.map((rate, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center">
                  <Title level={3} className="mb-2">{rate.level}</Title>
                  <Tag color={rate.color} className="text-lg px-4 py-2 mb-2">
                    {rate.rate}
                  </Tag>
                  <Paragraph className="text-gray-600">
                    Từ {formatCurrency(rate.minSales)}/tháng
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Lợi Ích Khi Tham Gia</Title>
          <Row gutter={[24, 24]}>
            {affiliateBenefits.map((benefit, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <Title level={4} className="mb-2">{benefit.title}</Title>
                  <Paragraph className="text-gray-600">{benefit.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Câu Chuyện Thành Công</Title>
          <Row gutter={[24, 24]}>
            {successStories.map((story, index) => (
              <Col xs={24} md={12} key={index}>
                <Card>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title level={4} className="mb-1">{story.name}</Title>
                      <Text className="text-gray-600">{story.description}</Text>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Text strong className="text-green-600 text-lg">
                        {story.earnings}
                      </Text>
                      <br />
                      <Text className="text-gray-500">Thu nhập</Text>
                    </div>
                    <div className="text-center">
                      <Text strong className="text-blue-600 text-lg">
                        {story.period}
                      </Text>
                      <br />
                      <Text className="text-gray-500">Thời gian</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Cách Thức Kiếm Tiền</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">🔗</div>
                <Title level={4}>Tạo Link Giới Thiệu</Title>
                <Paragraph>
                  Tạo link giới thiệu cho sản phẩm bạn muốn chia sẻ. Link này sẽ chứa mã affiliate của bạn.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">📱</div>
                <Title level={4}>Chia Sẻ Trên Mạng Xã Hội</Title>
                <Paragraph>
                  Chia sẻ link trên Facebook, Instagram, YouTube, blog hoặc bất kỳ kênh nào bạn có.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <div className="text-4xl mb-4">💰</div>
                <Title level={4}>Nhận Hoa Hồng</Title>
                <Paragraph>
                  Khi có người mua hàng qua link của bạn, bạn sẽ nhận hoa hồng tương ứng.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Register Modal */}
        <Modal
          title="Đăng Ký Chương Trình Affiliate"
          open={isRegisterModalVisible}
          onCancel={() => setIsRegisterModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} onFinish={handleRegister} layout="vertical">
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
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="platform"
                  label="Nền tảng chính"
                  rules={[{ required: true, message: 'Vui lòng chọn nền tảng' }]}
                >
                  <Select placeholder="Chọn nền tảng">
                    <Option value="facebook">Facebook</Option>
                    <Option value="instagram">Instagram</Option>
                    <Option value="youtube">YouTube</Option>
                    <Option value="blog">Blog/Website</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="audience"
              label="Quy mô audience"
              rules={[{ required: true, message: 'Vui lòng chọn quy mô audience' }]}
            >
              <Select placeholder="Chọn quy mô audience">
                <Option value="small">Dưới 1.000 người</Option>
                <Option value="medium">1.000 - 10.000 người</Option>
                <Option value="large">10.000 - 100.000 người</Option>
                <Option value="huge">Trên 100.000 người</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả về bản thân"
              rules={[
                { required: true, message: 'Vui lòng mô tả về bản thân' },
                { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả về bản thân và cách bạn sẽ quảng bá sản phẩm..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Gửi Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Contact */}
        <div className="text-center">
          <Card className="bg-gray-50">
            <Title level={3} className="mb-4">
              Cần Hỗ Trợ Thêm?
            </Title>
            <Space size="large">
              <Button icon={<PhoneOutlined />}>
                1900 1234
              </Button>
              <Button icon={<MailOutlined />}>
                affiliate@tonicstore.com
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;
