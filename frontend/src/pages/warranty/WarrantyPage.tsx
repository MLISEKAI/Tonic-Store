import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Form, Input, Select, Upload, message, Steps, List, Alert, Space, Tag } from 'antd';
import { 
  ToolOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const WarrantyPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const warrantySteps = [
    {
      title: 'Kiểm Tra Bảo Hành',
      description: 'Xác nhận sản phẩm còn trong thời hạn bảo hành',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Điền Thông Tin',
      description: 'Cung cấp thông tin sản phẩm và lỗi gặp phải',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Gửi Yêu Cầu',
      description: 'Gửi yêu cầu bảo hành và chờ xác nhận',
      icon: <UploadOutlined />,
    },
    {
      title: 'Xử Lý Bảo Hành',
      description: 'Chúng tôi sẽ xử lý và liên hệ với bạn',
      icon: <ToolOutlined />,
    },
  ];

  const warrantyPolicies = [
    {
      category: 'Thời Trang',
      period: '6 tháng',
      coverage: 'Lỗi sản xuất, hư hỏng do chất lượng',
      conditions: [
        'Sản phẩm còn nguyên vẹn, chưa sửa chữa',
        'Có hóa đơn mua hàng hợp lệ',
        'Không do tác động từ bên ngoài',
        'Không do sử dụng sai cách',
      ],
    },
    {
      category: 'Điện Tử',
      period: '12 tháng',
      coverage: 'Lỗi kỹ thuật, hư hỏng phần cứng',
      conditions: [
        'Sản phẩm còn nguyên vẹn, chưa mở máy',
        'Có tem bảo hành và hóa đơn',
        'Không do va đập, nước vào',
        'Không do sử dụng sai điện áp',
      ],
    },
    {
      category: 'Phụ Kiện',
      period: '3 tháng',
      coverage: 'Lỗi sản xuất, hư hỏng do chất lượng',
      conditions: [
        'Sản phẩm còn nguyên vẹn',
        'Có hóa đơn mua hàng',
        'Không do tác động cơ học',
        'Không do sử dụng sai mục đích',
      ],
    },
  ];

  const warrantyTypes = [
    {
      type: 'Sửa chữa',
      description: 'Sửa chữa sản phẩm bị lỗi',
      time: '7-14 ngày',
      cost: 'Miễn phí',
    },
    {
      type: 'Đổi mới',
      description: 'Đổi sản phẩm mới tương đương',
      time: '3-5 ngày',
      cost: 'Miễn phí',
    },
    {
      type: 'Hoàn tiền',
      description: 'Hoàn tiền nếu không thể sửa chữa',
      time: '5-7 ngày',
      cost: 'Miễn phí',
    },
  ];

  const faqs = [
    {
      question: 'Sản phẩm của tôi có được bảo hành không?',
      answer: 'Tất cả sản phẩm chính hãng đều được bảo hành theo chính sách của nhà sản xuất. Thời gian bảo hành tùy thuộc vào loại sản phẩm.',
    },
    {
      question: 'Làm thế nào để kiểm tra tình trạng bảo hành?',
      answer: 'Bạn có thể kiểm tra tình trạng bảo hành bằng cách nhập mã sản phẩm hoặc số IMEI trên website của chúng tôi.',
    },
    {
      question: 'Chi phí bảo hành là bao nhiêu?',
      answer: 'Bảo hành hoàn toàn miễn phí nếu sản phẩm còn trong thời hạn bảo hành và đáp ứng các điều kiện bảo hành.',
    },
    {
      question: 'Thời gian xử lý bảo hành là bao lâu?',
      answer: 'Thời gian xử lý bảo hành từ 7-14 ngày tùy thuộc vào loại sản phẩm và tình trạng hư hỏng.',
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      console.log('Warranty request submitted:', values);
      message.success('Yêu cầu bảo hành đã được gửi! Chúng tôi sẽ liên hệ lại trong vòng 24h.');
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Chính Sách Bảo Hành
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Cam kết bảo hành sản phẩm chất lượng và dịch vụ hỗ trợ tận tình
          </Paragraph>
        </div>

        {/* Warranty Process */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Quy Trình Bảo Hành</Title>
          <Steps
            current={currentStep}
            items={warrantySteps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon,
            }))}
            className="mb-8"
          />
        </div>

        {/* Warranty Policies */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Chính Sách Bảo Hành Theo Danh Mục</Title>
          <Row gutter={[24, 24]}>
            {warrantyPolicies.map((policy, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full">
                  <Title level={3} className="text-center mb-4">{policy.category}</Title>
                  <div className="text-center mb-4">
                    <Tag color="blue" className="text-lg px-4 py-2">
                      {policy.period}
                    </Tag>
                  </div>
                  <Paragraph className="text-center mb-4">
                    <Text strong>{policy.coverage}</Text>
                  </Paragraph>
                  <Title level={5} className="mb-3">Điều kiện bảo hành:</Title>
                  <List
                    size="small"
                    dataSource={policy.conditions}
                    renderItem={(condition) => (
                      <List.Item>
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        {condition}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Warranty Types */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Loại Hình Bảo Hành</Title>
          <Row gutter={[24, 24]}>
            {warrantyTypes.map((type, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">🔧</div>
                  <Title level={4} className="mb-2">{type.type}</Title>
                  <Paragraph className="text-gray-600 mb-4">{type.description}</Paragraph>
                  <div className="space-y-2">
                    <div>
                      <Text strong>Thời gian: </Text>
                      <Text>{type.time}</Text>
                    </div>
                    <div>
                      <Text strong>Chi phí: </Text>
                      <Text className="text-green-600">{type.cost}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Warranty Request Form */}
        <div className="mb-16">
          <Title level={2} className="text-center mb-8">Yêu Cầu Bảo Hành</Title>
          <Card className="max-w-2xl mx-auto">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="orderNumber"
                    label="Mã đơn hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
                  >
                    <Input placeholder="VD: TONIC2024001" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="productCode"
                    label="Mã sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
                  >
                    <Input placeholder="Mã sản phẩm" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="issueType"
                label="Loại lỗi"
                rules={[{ required: true, message: 'Vui lòng chọn loại lỗi' }]}
              >
                <Select placeholder="Chọn loại lỗi gặp phải">
                  <Option value="hardware">Lỗi phần cứng</Option>
                  <Option value="software">Lỗi phần mềm</Option>
                  <Option value="cosmetic">Lỗi thẩm mỹ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả chi tiết lỗi"
                rules={[
                  { required: true, message: 'Vui lòng mô tả chi tiết lỗi' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết về lỗi gặp phải..."
                />
              </Form.Item>

              <Form.Item
                name="images"
                label="Hình ảnh minh chứng"
                extra="Tải lên hình ảnh sản phẩm bị lỗi để chúng tôi có thể hỗ trợ tốt hơn"
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
                  Gửi Yêu Cầu Bảo Hành
                </Button>
              </Form.Item>
            </Form>
          </Card>
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

        {/* Contact Support */}
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <Space direction="vertical" size="large">
              <Title level={3} className="text-blue-800">
                Cần Hỗ Trợ Thêm?
              </Title>
              <Paragraph className="text-blue-700">
                Đội ngũ hỗ trợ bảo hành của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  1900 1234
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  warranty@tonicstore.com
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
