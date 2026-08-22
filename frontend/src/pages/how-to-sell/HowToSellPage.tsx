import React, { useRef } from 'react';
import { Card, Steps, Typography, Row, Col, Space, Button, List, Alert, Avatar } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  PhoneOutlined,
  MessageOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const HowToSellPage: React.FC = () => {
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleStepChange = (index: number) => {
    contentRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  const steps = [
    {
      title: 'Đăng Ký Bán Hàng',
      description: 'Tạo tài khoản người bán',
      icon: <UserOutlined />,
      content: (
        <div>
          <Paragraph>
            Bước đầu tiên để trở thành người bán trên Tonic Store:
          </Paragraph>
          <List
            dataSource={[
              'Đăng ký tài khoản người bán',
              'Cung cấp thông tin doanh nghiệp',
              'Xác minh danh tính và giấy phép kinh doanh',
              'Ký hợp đồng hợp tác',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: 'Tạo Cửa Hàng',
      description: 'Thiết lập cửa hàng online',
      icon: <ShopOutlined />,
      content: (
        <div>
          <Paragraph>
            Thiết lập cửa hàng của bạn trên nền tảng:
          </Paragraph>
          <List
            dataSource={[
              'Chọn tên cửa hàng và logo',
              'Viết mô tả cửa hàng hấp dẫn',
              'Thiết lập chính sách bán hàng',
              'Cấu hình thông tin liên hệ',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: 'Đăng Sản Phẩm',
      description: 'Thêm sản phẩm vào cửa hàng',
      icon: <ShopOutlined />,
      content: (
        <div>
          <Paragraph>
            Tạo danh mục sản phẩm cho cửa hàng:
          </Paragraph>
          <List
            dataSource={[
              'Chụp ảnh sản phẩm chất lượng cao',
              'Viết mô tả chi tiết và hấp dẫn',
              'Đặt giá cạnh tranh',
              'Thiết lập kho hàng và vận chuyển',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: 'Bán Hàng & Thu Lợi',
      description: 'Quản lý đơn hàng và thu nhập',
      icon: <DollarOutlined />,
      content: (
        <div>
          <Paragraph>
            Quản lý hoạt động bán hàng hiệu quả:
          </Paragraph>
          <List
            dataSource={[
              'Xử lý đơn hàng nhanh chóng',
              'Giao hàng đúng hạn',
              'Chăm sóc khách hàng tốt',
              'Theo dõi doanh thu và lợi nhuận',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  const benefits = [
    {
      title: 'Miễn Phí Đăng Ký',
      description: 'Không phí đăng ký, chỉ trả phí khi có giao dịch',
      icon: '💰',
    },
    {
      title: 'Tiếp Cận Hàng Triệu Khách Hàng',
      description: 'Tận dụng lượng khách hàng lớn của Tonic Store',
      icon: '👥',
    },
    {
      title: 'Công Cụ Quản Lý Mạnh Mẽ',
      description: 'Dashboard quản lý đơn hàng, kho hàng, doanh thu',
      icon: '📊',
    },
    {
      title: 'Hỗ Trợ Marketing',
      description: 'Các công cụ quảng cáo và khuyến mãi tích hợp',
      icon: '📢',
    },
    {
      title: 'Thanh Toán An Toàn',
      description: 'Hệ thống thanh toán bảo mật, thu tiền nhanh chóng',
      icon: '🔒',
    },
    {
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng giúp đỡ',
      icon: '🛟',
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
    {
      title: 'Kinh Nghiệm Bán Hàng',
      description: 'Có kinh nghiệm bán hàng online (khuyến khích)',
      required: false,
    },
  ];

  const commissionRates = [
    { category: 'Thời Trang', rate: '8-12%' },
    { category: 'Điện Tử', rate: '5-8%' },
    { category: 'Nhà Cửa', rate: '6-10%' },
    { category: 'Làm Đẹp', rate: '10-15%' },
    { category: 'Thể Thao', rate: '7-11%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Hướng Dẫn Bán Hàng
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Trở thành đối tác bán hàng của Tonic Store và cùng phát triển kinh doanh
          </Paragraph>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Tại Sao Chọn Tonic Store?</Title>
          <Row gutter={[24, 24]}>
            {benefits.map((benefit, index) => (
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

        {/* Steps */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Quy Trình Trở Thành Người Bán</Title>
          <Steps
            direction="vertical"
            items={steps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon,
            }))}
            onChange={handleStepChange}
          />
          
          <div className="mt-8">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => { contentRefs.current[index] = el; }}
                className="mb-6 scroll-mt-[156px]"
              >
              <Card key={index} className="mb-6">
                <Title level={3} className="mb-4">
                  Bước {index + 1}: {step.title}
                </Title>
                {step.content}
              </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Yêu Cầu Trở Thành Người Bán</Title>
          <Row gutter={[24, 24]}>
            {requirements.map((req, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="h-full">
                  <div className="flex items-start space-x-3">
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

        {/* Commission Rates */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Phí Hoa Hồng Theo Danh Mục</Title>
          <Card>
            <Row gutter={[16, 16]}>
              {commissionRates.map((item, index) => (
                <Col xs={24} sm={12} md={8} lg={4} key={index}>
                  <Card className="text-center">
                    <Title level={4} className="mb-2">{item.category}</Title>
                    <Text strong className="text-2xl text-blue-600">{item.rate}</Text>
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
          </Card>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Câu Chuyện Thành Công</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar size={64} src="https://img.freepik.com/premium-photo/portrait-young-businesswoman_136595-1234.jpg" />
                  <div>
                    <Title level={4} className="mb-1">Chị Nguyễn Thị A</Title>
                    <Text className="text-gray-600">Chủ cửa hàng thời trang</Text>
                  </div>
                </div>
                <Paragraph>
                  "Từ khi bán hàng trên Tonic Store, doanh thu của tôi tăng 300% trong 6 tháng. 
                  Hệ thống quản lý rất tiện lợi và khách hàng rất hài lòng."
                </Paragraph>
                <div className="flex items-center space-x-4 mt-4">
                  <Space>
                    <TrophyOutlined className="text-yellow-500" />
                    <Text strong>Doanh thu: 500 triệu/tháng</Text>
                  </Space>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar size={64} src="https://img.freepik.com/premium-photo/portrait-young-businessman_136595-5678.jpg" />
                  <div>
                    <Title level={4} className="mb-1">Anh Trần Văn B</Title>
                    <Text className="text-gray-600">Chủ cửa hàng điện tử</Text>
                  </div>
                </div>
                <Paragraph>
                  "Tonic Store giúp tôi tiếp cận được nhiều khách hàng hơn. 
                  Công cụ marketing tích hợp rất hiệu quả và dễ sử dụng."
                </Paragraph>
                <div className="flex items-center space-x-4 mt-4">
                  <Space>
                    <TrophyOutlined className="text-yellow-500" />
                    <Text strong>Doanh thu: 800 triệu/tháng</Text>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <Space direction="vertical" size="large">
              <Title level={2} className="text-gray-800">
                Sẵn Sàng Bắt Đầu?
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Đăng ký ngay để trở thành đối tác bán hàng của Tonic Store
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large">
                  Đăng Ký Bán Hàng
                </Button>
                <Button size="large" icon={<MessageOutlined />}>
                  Tư Vấn Miễn Phí
                </Button>
              </Space>
            </Space>
          </Card>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-50">
            <Title level={3} className="mb-4">
              Cần Hỗ Trợ Thêm?
            </Title>
            <Space size="large">
              <Button icon={<PhoneOutlined />}>
                1900 1234
              </Button>
              <Button icon={<MessageOutlined />}>
                seller@tonicstore.com
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowToSellPage;
