import React, { useRef } from 'react';
import { Card, Steps, Typography, Row, Col, Space, Button, List, Alert } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  TruckOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title, Text, Paragraph } = Typography;

const HowToBuyPage: React.FC = () => {
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handleStepChange = (index: number) => {
    contentRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const steps = [
    {
      title: 'Tạo Tài Khoản',
      description: 'Đăng ký tài khoản miễn phí',
      icon: <UserOutlined />,
      content: (
        <div>
          <Paragraph>
            Để mua hàng trên Tonic Store, bạn cần tạo một tài khoản. Quá trình này rất đơn giản:
          </Paragraph>
          <List
            dataSource={[
              'Nhấn nút "Đăng ký" ở góc trên bên phải',
              'Điền thông tin: Họ tên, Email, Số điện thoại',
              'Tạo mật khẩu mạnh',
              'Xác nhận email để kích hoạt tài khoản',
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
      title: 'Chọn Sản Phẩm',
      description: 'Tìm kiếm và chọn sản phẩm yêu thích',
      icon: <ShoppingCartOutlined />,
      content: (
        <div>
          <Paragraph>
            Tìm kiếm sản phẩm theo nhiều cách khác nhau:
          </Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card size="small">
                <Title level={5}>Tìm kiếm theo tên</Title>
                <Text>Sử dụng thanh tìm kiếm để tìm sản phẩm theo tên</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small">
                <Title level={5}>Duyệt theo danh mục</Title>
                <Text>Khám phá sản phẩm theo từng danh mục</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small">
                <Title level={5}>Lọc theo giá</Title>
                <Text>Sử dụng bộ lọc để tìm sản phẩm trong khoảng giá mong muốn</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card size="small">
                <Title level={5}>Sắp xếp</Title>
                <Text>Sắp xếp theo giá, đánh giá, mới nhất</Text>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: 'Thêm Vào Giỏ Hàng',
      description: 'Thêm sản phẩm vào giỏ hàng',
      icon: <ShoppingCartOutlined />,
      content: (
        <div>
          <Paragraph>
            Khi đã chọn được sản phẩm ưng ý:
          </Paragraph>
          <List
            dataSource={[
              'Chọn size, màu sắc (nếu có)',
              'Chọn số lượng muốn mua',
              'Nhấn "Thêm vào giỏ hàng"',
              'Kiểm tra giỏ hàng và điều chỉnh nếu cần',
            ]}
            renderItem={(item) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
          <Alert
            message="Mẹo"
            description="Bạn có thể thêm nhiều sản phẩm vào giỏ hàng và thanh toán cùng lúc để tiết kiệm phí vận chuyển."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      ),
    },
    {
      title: 'Thanh Toán',
      description: 'Chọn phương thức thanh toán',
      icon: <CreditCardOutlined />,
      content: (
        <div>
          <Paragraph>
            Tonic Store hỗ trợ nhiều phương thức thanh toán:
          </Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card size="small" className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <Title level={5}>Thanh toán online</Title>
                <Text>VNPay, chuyển khoản ngân hàng</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <Title level={5}>COD</Title>
                <Text>Thanh toán khi nhận hàng</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <Title level={5}>Ví điện tử</Title>
                <Text>MoMo, ZaloPay, ViettelPay</Text>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: 'Nhận Hàng',
      description: 'Theo dõi và nhận hàng',
      icon: <TruckOutlined />,
      content: (
        <div>
          <Paragraph>
            Sau khi đặt hàng thành công:
          </Paragraph>
          <List
            dataSource={[
              'Nhận email xác nhận đơn hàng',
              'Theo dõi trạng thái đơn hàng trong tài khoản',
              'Nhận thông báo khi hàng được giao',
              'Kiểm tra hàng trước khi thanh toán (COD)',
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

  const tips = [
    {
      title: 'Kiểm tra size trước khi mua',
      description: 'Sử dụng bảng size hướng dẫn để chọn size phù hợp',
      icon: '📏',
    },
    {
      title: 'Đọc đánh giá sản phẩm',
      description: 'Xem đánh giá từ khách hàng khác để có cái nhìn khách quan',
      icon: '⭐',
    },
    {
      title: 'Sử dụng mã giảm giá',
      description: 'Tìm và sử dụng mã giảm giá để tiết kiệm chi phí',
      icon: '🎫',
    },
    {
      title: 'Chọn địa chỉ giao hàng chính xác',
      description: 'Đảm bảo địa chỉ giao hàng chính xác để tránh thất lạc',
      icon: '📍',
    },
  ];

  const faqs = [
    {
      question: 'Tôi có thể hủy đơn hàng không?',
      answer: 'Có, bạn có thể hủy đơn hàng trong vòng 30 phút sau khi đặt hàng. Sau thời gian này, đơn hàng sẽ được xử lý và không thể hủy.',
    },
    {
      question: 'Làm thế nào để đổi size sản phẩm?',
      answer: 'Bạn có thể yêu cầu đổi size trong vòng 7 ngày kể từ khi nhận hàng. Liên hệ hotline để được hướng dẫn chi tiết.',
    },
    {
      question: 'Tôi có thể mua hàng mà không cần tài khoản không?',
      answer: 'Không, bạn cần tạo tài khoản để mua hàng. Điều này giúp chúng tôi quản lý đơn hàng và bảo vệ thông tin của bạn.',
    },
    {
      question: 'Phí vận chuyển được tính như thế nào?',
      answer: 'Phí vận chuyển được tính dựa trên địa điểm giao hàng và trọng lượng sản phẩm. Miễn phí vận chuyển cho đơn hàng từ 500.000đ.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Hướng Dẫn Mua Hàng
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Hướng dẫn chi tiết từng bước để mua hàng trên Tonic Store một cách dễ dàng và an toàn
          </Paragraph>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <Steps
            // current={current}
            direction="vertical"
            size="default"
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
                ref={(el) => (contentRefs.current[index] = el)}
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

        {/* Tips */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Mẹo Mua Hàng Thông Minh</Title>
          <Row gutter={[24, 24]}>
            {tips.map((tip, index) => (
              <Col xs={24} sm={12} key={index}>
                <Card className="h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <Title level={4} className="mb-2">{tip.title}</Title>
                    <Paragraph className="text-gray-600">{tip.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Câu Hỏi Thường Gặp</Title>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Title level={4} className="mb-2">
                  <QuestionCircleOutlined className="text-blue-500 mr-2" />
                  {faq.question}
                </Title>
                <Paragraph className="text-gray-700">{faq.answer}</Paragraph>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Sẵn Sàng Mua Sắm?
              </Title>
              <Paragraph className="text-blue-700">
                Bây giờ bạn đã biết cách mua hàng, hãy khám phá những sản phẩm tuyệt vời của chúng tôi
              </Paragraph>
              <Space>
                <Link to="/products">
                  <Button type="primary" size="large">
                    Xem Sản Phẩm
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="large" icon={<MessageOutlined />}>
                    Cần Hỗ Trợ?
                  </Button>
                </Link>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowToBuyPage;
