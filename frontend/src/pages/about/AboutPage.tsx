import React from 'react';
import { Card, Row, Col, Typography, Statistic, Timeline, Avatar, Space } from 'antd';
import { 
  TeamOutlined, 
  TrophyOutlined, 
  HeartOutlined, 
  StarOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
  ShoppingCartOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  const stats = [
    { title: 'Khách Hàng', value: '1M+', icon: <CustomerServiceOutlined /> },
    { title: 'Sản Phẩm', value: '50K+', icon: <ShoppingCartOutlined /> },
    { title: 'Đơn Hàng', value: '2M+', icon: <TrophyOutlined /> },
    { title: 'Năm Kinh Nghiệm', value: '10+', icon: <StarOutlined /> },
  ];

  const values = [
    {
      icon: <HeartOutlined className="text-4xl text-red-500" />,
      title: 'Tận Tâm',
      description: 'Chúng tôi luôn đặt khách hàng làm trung tâm và cung cấp dịch vụ tốt nhất.',
    },
    {
      icon: <SafetyOutlined className="text-4xl text-blue-500" />,
      title: 'Uy Tín',
      description: 'Cam kết chất lượng sản phẩm và dịch vụ, đảm bảo quyền lợi khách hàng.',
    },
    {
      icon: <GlobalOutlined className="text-4xl text-green-500" />,
      title: 'Sáng Tạo',
      description: 'Luôn cập nhật xu hướng mới và mang đến những sản phẩm độc đáo.',
    },
    {
      icon: <TeamOutlined className="text-4xl text-purple-500" />,
      title: 'Đoàn Kết',
      description: 'Xây dựng môi trường làm việc tích cực và phát triển cùng nhau.',
    },
  ];

  const timeline = [
    {
      year: '2014',
      title: 'Thành Lập',
      description: 'Tonic Store được thành lập với tầm nhìn trở thành thương hiệu thời trang hàng đầu Việt Nam.',
    },
    {
      year: '2016',
      title: 'Mở Rộng Online',
      description: 'Ra mắt website thương mại điện tử, mở rộng phục vụ khách hàng trên toàn quốc.',
    },
    {
      year: '2018',
      title: 'Chuỗi Cửa Hàng',
      description: 'Mở rộng hệ thống cửa hàng tại các thành phố lớn: Hà Nội, TP.HCM, Đà Nẵng.',
    },
    {
      year: '2020',
      title: 'Công Nghệ Mới',
      description: 'Ứng dụng AI và AR trong mua sắm, nâng cao trải nghiệm khách hàng.',
    },
    {
      year: '2022',
      title: 'Bền Vững',
      description: 'Chuyển đổi sang mô hình kinh doanh bền vững, sử dụng vật liệu thân thiện môi trường.',
    },
    {
      year: '2024',
      title: 'Tương Lai',
      description: 'Tiếp tục phát triển và mở rộng ra thị trường quốc tế.',
    },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businessman_136595-1234.jpg',
      description: '15 năm kinh nghiệm trong ngành thời trang và retail.',
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: 'https://img.freepik.com/premium-photo/portrait-young-businesswoman_136595-5678.jpg',
      description: 'Chuyên gia công nghệ với nhiều năm kinh nghiệm phát triển e-commerce.',
    },
    {
      name: 'Lê Văn C',
      position: 'Head of Design',
      avatar: 'https://img.freepik.com/premium-photo/portrait-creative-designer_136595-9012.jpg',
      description: 'Nhà thiết kế tài năng với phong cách độc đáo và sáng tạo.',
    },
    {
      name: 'Phạm Thị D',
      position: 'Head of Marketing',
      avatar: 'https://img.freepik.com/premium-photo/portrait-marketing-manager_136595-3456.jpg',
      description: 'Chuyên gia marketing với nhiều chiến dịch thành công.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Title level={1} className="text-5xl font-bold text-gray-800 mb-6">
            Về Tonic Store
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tonic Store là thương hiệu thời trang hàng đầu Việt Nam, cam kết mang đến những sản phẩm chất lượng cao 
            và dịch vụ khách hàng xuất sắc. Với hơn 10 năm kinh nghiệm, chúng tôi đã phục vụ hàng triệu khách hàng 
            trên toàn quốc.
          </Paragraph>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-12">Thành Tựu Của Chúng Tôi</Title>
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl text-blue-500 mb-4">
                    {stat.icon}
                  </div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <Card className="h-full">
                <div className="text-center mb-6">
                  <TrophyOutlined className="text-5xl text-yellow-500 mb-4" />
                  <Title level={3}>Sứ Mệnh</Title>
                </div>
                <Paragraph className="text-lg text-gray-700">
                  Chúng tôi cam kết mang đến những sản phẩm thời trang chất lượng cao, 
                  phù hợp với mọi phong cách và ngân sách. Chúng tôi tin rằng mọi người 
                  đều xứng đáng có được những sản phẩm đẹp và chất lượng.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="h-full">
                <div className="text-center mb-6">
                  <StarOutlined className="text-5xl text-purple-500 mb-4" />
                  <Title level={3}>Tầm Nhìn</Title>
                </div>
                <Paragraph className="text-lg text-gray-700">
                  Trở thành thương hiệu thời trang hàng đầu Đông Nam Á, được yêu thích 
                  bởi khách hàng và được công nhận về chất lượng sản phẩm cũng như dịch vụ 
                  khách hàng xuất sắc.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Values */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-12">Giá Trị Cốt Lõi</Title>
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    {value.icon}
                  </div>
                  <Title level={4} className="mb-4">{value.title}</Title>
                  <Paragraph className="text-gray-600">
                    {value.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-12">Hành Trình Phát Triển</Title>
          <Timeline
            mode="alternate"
            items={timeline.map(item => ({
              children: (
                <Card className="max-w-md">
                  <Title level={4} className="text-blue-600 mb-2">{item.year}</Title>
                  <Title level={5} className="mb-2">{item.title}</Title>
                  <Paragraph className="text-gray-600">{item.description}</Paragraph>
                </Card>
              ),
            }))}
          />
        </div>

        {/* Team */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-12">Đội Ngũ Lãnh Đạo</Title>
          <Row gutter={[24, 24]}>
            {team.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full">
                  <Avatar size={120} src={member.avatar} className="mb-4" />
                  <Title level={4} className="mb-2">{member.name}</Title>
                  <Text strong className="text-blue-600 mb-3 block">{member.position}</Text>
                  <Paragraph className="text-gray-600">
                    {member.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <Space direction="vertical" size="large">
              <Title level={2} className="text-gray-800">
                Bạn Có Câu Hỏi Về Chúng Tôi?
              </Title>
              <Paragraph className="text-lg text-gray-600">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </Paragraph>
              <Space size="large">
                <a href="/contact" className="text-blue-600 hover:text-blue-800">
                  Liên Hệ Với Chúng Tôi
                </a>
                <a href="/careers" className="text-blue-600 hover:text-blue-800">
                  Gia Nhập Đội Ngũ
                </a>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
