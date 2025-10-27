import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, Tag, Modal, Form, Select, Steps, Alert } from 'antd';
import { 
  ShopOutlined, 
  UserOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SellerPage: React.FC = () => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [form] = Form.useForm();

  const sellerSteps = [
    {
      title: 'Đăng Ký',
      description: 'Tạo tài khoản người bán',
      icon: <UserOutlined />,
    },
    {
      title: 'Xác Minh',
      description: 'Xác minh danh tính và giấy phép',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Tạo Cửa Hàng',
      description: 'Thiết lập cửa hàng online',
      icon: <ShopOutlined />,
    },
    {
      title: 'Bắt Đầu Bán',
      description: 'Đăng sản phẩm và bán hàng',
      icon: <DollarOutlined />,
    },
  ];

  const sellerBenefits = [
    {
      title: 'Miễn Phí Đăng Ký',
      description: 'Không phí đăng ký, chỉ trả phí khi có giao dịch',
      icon: '💰',
    },
    {
      title: 'Tiếp Cận Rộng',
      description: 'Hàng triệu khách hàng tiềm năng',
      icon: '👥',
    },
    {
      title: 'Công Cụ Quản Lý',
      description: 'Dashboard quản lý đơn hàng, kho hàng',
      icon: '📊',
    },
    {
      title: 'Hỗ Trợ Marketing',
      description: 'Công cụ quảng cáo và khuyến mãi',
      icon: '📢',
    },
    {
      title: 'Thanh Toán An Toàn',
      description: 'Hệ thống thanh toán bảo mật',
      icon: '🔒',
    },
    {
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ hỗ trợ chuyên nghiệp',
      icon: '🛟',
    },
  ];

  const commissionRates = [
    { category: 'Thời Trang', rate: '8-12%', color: 'blue' },
    { category: 'Điện Tử', rate: '5-8%', color: 'green' },
    { category: 'Nhà Cửa', rate: '6-10%', color: 'orange' },
    { category: 'Làm Đẹp', rate: '10-15%', color: 'purple' },
    { category: 'Thể Thao', rate: '7-11%', color: 'red' },
  ];

  const successStories = [
    {
      name: 'Chị Nguyễn Thị A',
      business: 'Cửa hàng thời trang',
      revenue: '500 triệu/tháng',
      period: '6 tháng',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businesswoman_136595-1234.jpg',
    },
    {
      name: 'Anh Trần Văn B',
      business: 'Cửa hàng điện tử',
      revenue: '800 triệu/tháng',
      period: '1 năm',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businessman_136595-5678.jpg',
    },
  ];

  const requirements = [
    {
      title: 'Giấy Phép Kinh Doanh',
      description: 'Có giấy phép kinh doanh hợp lệ',
      required: true,
    },
    {
      title: 'Sản Phẩm Chất Lượng',
      description: 'Sản phẩm đảm bảo chất lượng, có nguồn gốc rõ ràng',
      required: true,
    },
    {
      title: 'Kho Hàng',
      description: 'Có khả năng lưu trữ và quản lý kho hàng',
      required: true,
    },
    {
      title: 'Dịch Vụ Khách Hàng',
      description: 'Có khả năng chăm sóc khách hàng tốt',
      required: true,
    },
  ];

  const handleRegister = (values: any) => {
    console.log('Seller registration:', values);
    setIsRegisterModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Kênh Người Bán
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Trở thành đối tác bán hàng của Tonic Store và cùng phát triển kinh doanh
          </Paragraph>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={2} className="text-gray-800">
                Sẵn Sàng Bắt Đầu Bán Hàng?
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Tham gia cùng hàng nghìn người bán đang thành công trên Tonic Store
              </Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={() => setIsRegisterModalVisible(true)}
              >
                Đăng Ký Ngay
              </Button>
            </Space>
          </Card>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Quy Trình Trở Thành Người Bán</Title>
          <Steps
            items={sellerSteps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon,
            }))}
            className="mb-8"
          />
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Lợi Ích Khi Bán Hàng</Title>
          <Row gutter={[24, 24]}>
            {sellerBenefits.map((benefit, index) => (
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

        {/* Commission Rates */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Phí Hoa Hồng Theo Danh Mục</Title>
          <Row gutter={[16, 16]}>
            {commissionRates.map((item, index) => (
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Card className="text-center">
                  <Title level={4} className="mb-2">{item.category}</Title>
                  <Tag color={item.color} className="text-lg px-4 py-2">
                    {item.rate}
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
          <Alert
            message="Lưu ý"
            description="Phí hoa hồng được tính trên giá bán cuối cùng (sau khi trừ khuyến mãi). Phí có thể thay đổi tùy theo chính sách và thỏa thuận cụ thể."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Câu Chuyện Thành Công</Title>
          <Row gutter={[24, 24]}>
            {successStories.map((story, index) => (
              <Col xs={24} md={12} key={index}>
                <Card>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <Title level={4} className="mb-1">{story.name}</Title>
                      <Text className="text-gray-600">{story.business}</Text>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Text strong className="text-green-600 text-lg">
                        {story.revenue}
                      </Text>
                      <br />
                      <Text className="text-gray-500">Doanh thu</Text>
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

        {/* Requirements */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Yêu Cầu Trở Thành Người Bán</Title>
          <Row gutter={[24, 24]}>
            {requirements.map((req, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="h-full">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {req.required ? (
                        <CheckCircleOutlined className="text-green-500 text-xl" />
                      ) : (
                        <QuestionCircleOutlined className="text-blue-500 text-xl" />
                      )}
                    </div>
                    <div>
                      <Title level={4} className="mb-2">{req.title}</Title>
                      <Paragraph className="text-gray-600">{req.description}</Paragraph>
                      <Text className={req.required ? "text-red-500" : "text-blue-500"}>
                        {req.required ? "Bắt buộc" : "Khuyến khích"}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Register Modal */}
        <Modal
          title="Đăng Ký Trở Thành Người Bán"
          open={isRegisterModalVisible}
          onCancel={() => setIsRegisterModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} onFinish={handleRegister} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="businessName"
                  label="Tên doanh nghiệp"
                  rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp' }]}
                >
                  <Input placeholder="Tên doanh nghiệp" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="contactPerson"
                  label="Người liên hệ"
                  rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ' }]}
                >
                  <Input placeholder="Họ và tên" />
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
                  <Input placeholder="Email doanh nghiệp" />
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
              name="businessType"
              label="Loại hình kinh doanh"
              rules={[{ required: true, message: 'Vui lòng chọn loại hình kinh doanh' }]}
            >
              <Select placeholder="Chọn loại hình kinh doanh">
                <Option value="individual">Cá nhân</Option>
                <Option value="enterprise">Doanh nghiệp</Option>
                <Option value="cooperative">Hợp tác xã</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="mainCategory"
              label="Danh mục chính"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục chính' }]}
            >
              <Select placeholder="Chọn danh mục sản phẩm chính">
                <Option value="fashion">Thời Trang</Option>
                <Option value="electronics">Điện Tử</Option>
                <Option value="home">Nhà Cửa</Option>
                <Option value="beauty">Làm Đẹp</Option>
                <Option value="sports">Thể Thao</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả doanh nghiệp"
              rules={[
                { required: true, message: 'Vui lòng mô tả doanh nghiệp' },
                { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mô tả về doanh nghiệp và sản phẩm của bạn..."
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
                seller@tonicstore.com
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
