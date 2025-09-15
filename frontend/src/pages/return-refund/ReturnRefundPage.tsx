import React, { useState } from 'react';
import { Card, Steps, Typography, Row, Col, Button, Form, Input, Select, Upload, message, Alert, List, Space } from 'antd';
import { 
  FileTextOutlined, 
  ShoppingCartOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReturnRefundPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const returnSteps = [
    {
      title: 'Kiểm Tra Điều Kiện',
      description: 'Xác nhận đơn hàng đủ điều kiện đổi trả',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Điền Thông Tin',
      description: 'Cung cấp thông tin đơn hàng và lý do đổi trả',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Gửi Hàng Về',
      description: 'Đóng gói và gửi hàng về địa chỉ của chúng tôi',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Hoàn Tiền',
      description: 'Chúng tôi kiểm tra và hoàn tiền cho bạn',
      icon: <CheckCircleOutlined />,
    },
  ];

  const returnConditions = [
    {
      title: 'Thời Gian Đổi Trả',
      content: '7 ngày kể từ khi nhận hàng',
      icon: '⏰',
    },
    {
      title: 'Tình Trạng Sản Phẩm',
      content: 'Còn nguyên vẹn, chưa sử dụng, có đầy đủ phụ kiện',
      icon: '📦',
    },
    {
      title: 'Hóa Đơn',
      content: 'Có hóa đơn mua hàng hoặc email xác nhận',
      icon: '🧾',
    },
    {
      title: 'Loại Sản Phẩm',
      content: 'Không phải đồ lót, sản phẩm cá nhân hóa',
      icon: '👕',
    },
  ];

  const returnReasons = [
    'Sản phẩm bị lỗi',
    'Không đúng mô tả',
    'Giao sai sản phẩm',
    'Không vừa size',
    'Không thích sản phẩm',
    'Thay đổi ý định',
    'Khác',
  ];

  const refundMethods = [
    {
      method: 'Hoàn tiền vào tài khoản ngân hàng',
      time: '3-5 ngày làm việc',
      icon: '🏦',
    },
    {
      method: 'Hoàn tiền vào ví điện tử',
      time: '1-2 ngày làm việc',
      icon: '📱',
    },
    {
      method: 'Hoàn tiền vào tài khoản Tonic Store',
      time: 'Ngay lập tức',
      icon: '💳',
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      console.log('Return request submitted:', values);
      message.success('Yêu cầu đổi trả đã được gửi! Chúng tôi sẽ liên hệ lại trong vòng 24h.');
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Đổi Trả & Hoàn Tiền
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Chính sách đổi trả và hoàn tiền linh hoạt, đảm bảo quyền lợi khách hàng
          </Paragraph>
        </div>

        {/* Return Process Steps */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Quy Trình Đổi Trả</Title>
          <Steps
            current={currentStep}
            items={returnSteps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon,
            }))}
            className="mb-8"
          />
        </div>

        {/* Return Conditions */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Điều Kiện Đổi Trả</Title>
          <Row gutter={[24, 24]}>
            {returnConditions.map((condition, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{condition.icon}</div>
                  <Title level={4} className="mb-2">{condition.title}</Title>
                  <Paragraph className="text-gray-600">{condition.content}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Return Form */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Yêu Cầu Đổi Trả</Title>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="max-w-2xl mx-auto"
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
              </Row>

              <Form.Item
                name="reason"
                label="Lý do đổi trả"
                rules={[{ required: true, message: 'Vui lòng chọn lý do đổi trả' }]}
              >
                <Select placeholder="Chọn lý do đổi trả">
                  {returnReasons.map(reason => (
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
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết về vấn đề hoặc lý do đổi trả..."
                />
              </Form.Item>

              <Form.Item
                name="images"
                label="Hình ảnh sản phẩm"
                extra="Tải lên hình ảnh sản phẩm để chúng tôi có thể hỗ trợ tốt hơn"
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
                  Gửi Yêu Cầu Đổi Trả
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Refund Methods */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Phương Thức Hoàn Tiền</Title>
          <Row gutter={[24, 24]}>
            {refundMethods.map((method, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <Title level={4} className="mb-2">{method.method}</Title>
                  <Text className="text-gray-600">Thời gian: {method.time}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <Title level={2} className="text-center mb-8">Câu Hỏi Thường Gặp</Title>
          <div className="space-y-4">
            <Card>
              <Title level={4}>Tôi có thể đổi trả sản phẩm sau 7 ngày không?</Title>
              <Paragraph>
                Rất tiếc, chúng tôi chỉ chấp nhận đổi trả trong vòng 7 ngày kể từ khi nhận hàng. 
                Tuy nhiên, nếu sản phẩm có lỗi từ nhà sản xuất, chúng tôi sẽ xem xét từng trường hợp cụ thể.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>Phí vận chuyển đổi trả ai chịu?</Title>
              <Paragraph>
                Nếu sản phẩm có lỗi từ phía chúng tôi, chúng tôi sẽ chịu phí vận chuyển. 
                Nếu bạn đổi trả vì lý do cá nhân, phí vận chuyển sẽ do bạn chịu.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>Thời gian hoàn tiền là bao lâu?</Title>
              <Paragraph>
                Thời gian hoàn tiền tùy thuộc vào phương thức thanh toán: 
                Tài khoản ngân hàng: 3-5 ngày, Ví điện tử: 1-2 ngày, 
                Tài khoản Tonic Store: ngay lập tức.
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>Tôi có thể đổi size thay vì trả hàng không?</Title>
              <Paragraph>
                Có, bạn có thể yêu cầu đổi size trong vòng 7 ngày. 
                Chúng tôi sẽ kiểm tra tình trạng sản phẩm và size có sẵn để xử lý yêu cầu của bạn.
              </Paragraph>
            </Card>
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
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large" icon={<PhoneOutlined />}>
                  1900 1234
                </Button>
                <Button size="large" icon={<MailOutlined />}>
                  support@tonicstore.com
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPage;
