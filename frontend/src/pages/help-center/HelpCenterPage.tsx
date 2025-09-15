import React, { useState } from 'react';
import { Card, Collapse, Input, Button, Typography, Space, Tag } from 'antd';
import { SearchOutlined, QuestionCircleOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HelpCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      key: '1',
      label: 'Làm thế nào để đặt hàng?',
      children: (
        <div>
          <Paragraph>
            Để đặt hàng trên Tonic Store, bạn có thể làm theo các bước sau:
          </Paragraph>
          <ol>
            <li>Đăng nhập vào tài khoản của bạn</li>
            <li>Chọn sản phẩm muốn mua và thêm vào giỏ hàng</li>
            <li>Kiểm tra giỏ hàng và nhấn "Thanh toán"</li>
            <li>Điền thông tin giao hàng và chọn phương thức thanh toán</li>
            <li>Xác nhận đơn hàng</li>
          </ol>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Các phương thức thanh toán nào được hỗ trợ?',
      children: (
        <div>
          <Paragraph>
            Tonic Store hỗ trợ các phương thức thanh toán sau:
          </Paragraph>
          <ul>
            <li>Thanh toán khi nhận hàng (COD)</li>
            <li>VNPay</li>
            <li>Chuyển khoản ngân hàng</li>
            <li>Ví điện tử</li>
          </ul>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Thời gian giao hàng là bao lâu?',
      children: (
        <div>
          <Paragraph>
            Thời gian giao hàng phụ thuộc vào địa điểm:
          </Paragraph>
          <ul>
            <li>TP. Hồ Chí Minh: 1-2 ngày làm việc</li>
            <li>Hà Nội: 2-3 ngày làm việc</li>
            <li>Các tỉnh thành khác: 3-5 ngày làm việc</li>
            <li>Vùng sâu vùng xa: 5-7 ngày làm việc</li>
          </ul>
        </div>
      ),
    },
    {
      key: '4',
      label: 'Làm thế nào để trả hàng/hoàn tiền?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể trả hàng trong vòng 7 ngày kể từ khi nhận hàng:
          </Paragraph>
          <ol>
            <li>Liên hệ hotline hoặc email để yêu cầu trả hàng</li>
            <li>Điền form trả hàng và gửi kèm hóa đơn</li>
            <li>Đóng gói sản phẩm nguyên vẹn</li>
            <li>Gửi hàng về địa chỉ của chúng tôi</li>
            <li>Chúng tôi sẽ hoàn tiền sau khi kiểm tra hàng</li>
          </ol>
        </div>
      ),
    },
    {
      key: '5',
      label: 'Làm thế nào để theo dõi đơn hàng?',
      children: (
        <div>
          <Paragraph>
            Bạn có thể theo dõi đơn hàng bằng cách:
          </Paragraph>
          <ul>
            <li>Đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi"</li>
            <li>Sử dụng mã đơn hàng để tra cứu</li>
            <li>Liên hệ hotline để được hỗ trợ</li>
          </ul>
        </div>
      ),
    },
  ];

  const contactMethods = [
    {
      icon: <PhoneOutlined />,
      title: 'Hotline',
      content: '1900 1234',
      description: 'Hỗ trợ 24/7',
      color: 'blue',
    },
    {
      icon: <MailOutlined />,
      title: 'Email',
      content: 'support@tonicstore.com',
      description: 'Phản hồi trong 24h',
      color: 'green',
    },
    {
      icon: <QuestionCircleOutlined />,
      title: 'Live Chat',
      content: 'Trò chuyện trực tiếp',
      description: 'Có sẵn 8:00 - 22:00',
      color: 'orange',
    },
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.children?.props.children[1]?.props.children.some((item: any) =>
      typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Trung Tâm Trợ Giúp
          </Title>
          <Text className="text-lg text-gray-600">
            Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ với chúng tôi
          </Text>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Search
            placeholder="Tìm kiếm câu hỏi..."
            allowClear
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-6">
            Liên Hệ Với Chúng Tôi
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
                bodyStyle={{ padding: '24px' }}
              >
                <div className="text-4xl mb-4 text-blue-500">
                  {method.icon}
                </div>
                <Title level={4} className="mb-2">
                  {method.title}
                </Title>
                <Text strong className="text-lg mb-2 block">
                  {method.content}
                </Text>
                <Tag color={method.color}>
                  {method.description}
                </Tag>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <Title level={2} className="text-center mb-6">
            Câu Hỏi Thường Gặp
          </Title>
          <Collapse
            items={filteredFAQs}
            className="bg-white"
            size="large"
          />
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Không Tìm Thấy Câu Trả Lời?
              </Title>
              <Text className="text-blue-700">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </Text>
              <Space>
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  Gọi Hotline
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  Gửi Email
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
