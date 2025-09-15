import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, List, Tag, Modal, Form, Select } from 'antd';
import { 
  WalletOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  HistoryOutlined,
  QrcodeOutlined,
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const walletBalance = 2500000;
  const tonicXu = 15000;
  const recentTransactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 1000000,
      description: 'Nạp tiền từ ngân hàng',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'purchase',
      amount: -250000,
      description: 'Mua áo thun nam',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'withdraw',
      amount: -500000,
      description: 'Rút tiền về ngân hàng',
      date: '2024-01-13',
      status: 'completed',
    },
    {
      id: 4,
      type: 'refund',
      amount: 150000,
      description: 'Hoàn tiền đơn hàng #12345',
      date: '2024-01-12',
      status: 'completed',
    },
  ];

  const paymentMethods = [
    {
      type: 'bank',
      name: 'Ngân hàng',
      icon: <BankOutlined className="text-2xl text-blue-500" />,
      description: 'Chuyển khoản ngân hàng',
    },
    {
      type: 'card',
      name: 'Thẻ tín dụng',
      icon: <CreditCardOutlined className="text-2xl text-green-500" />,
      description: 'Visa, Mastercard',
    },
    {
      type: 'mobile',
      name: 'Ví điện tử',
      icon: <MobileOutlined className="text-2xl text-purple-500" />,
      description: 'MoMo, ZaloPay, ViettelPay',
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <PlusOutlined className="text-green-500" />;
      case 'withdraw':
        return <MinusOutlined className="text-red-500" />;
      case 'purchase':
        return <WalletOutlined className="text-blue-500" />;
      case 'refund':
        return <HistoryOutlined className="text-orange-500" />;
      default:
        return <WalletOutlined className="text-gray-500" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Nạp tiền';
      case 'withdraw':
        return 'Rút tiền';
      case 'purchase':
        return 'Mua hàng';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return 'Giao dịch';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleDeposit = (values: any) => {
    console.log('Deposit values:', values);
    // Handle deposit logic
    setIsDepositModalVisible(false);
    form.resetFields();
  };

  const handleWithdraw = (values: any) => {
    console.log('Withdraw values:', values);
    // Handle withdraw logic
    setIsWithdrawModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Ví TonicPay
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Quản lý tài chính và thanh toán một cách tiện lợi
          </Paragraph>
        </div>

        {/* Balance Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={12}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-blue-100">Số dư ví chính</Text>
                  <Title level={2} className="text-white mb-0">
                    {formatCurrency(walletBalance)}
                  </Title>
                </div>
                <WalletOutlined className="text-6xl text-blue-200" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-purple-100">Tonic Xu</Text>
                  <Title level={2} className="text-white mb-0">
                    {tonicXu.toLocaleString()} Xu
                  </Title>
                </div>
                <QrcodeOutlined className="text-6xl text-purple-200" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={6}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              block
              onClick={() => setIsDepositModalVisible(true)}
            >
              Nạp Tiền
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              size="large"
              icon={<MinusOutlined />}
              block
              onClick={() => setIsWithdrawModalVisible(true)}
            >
              Rút Tiền
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button size="large" icon={<QrcodeOutlined />} block>
              QR Code
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button size="large" icon={<HistoryOutlined />} block>
              Lịch Sử
            </Button>
          </Col>
        </Row>

        {/* Recent Transactions */}
        <Card title="Giao Dịch Gần Đây" className="mb-8">
          <List
            dataSource={recentTransactions}
            renderItem={(transaction) => (
              <List.Item>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <Text strong>{transaction.description}</Text>
                      <br />
                      <Text className="text-gray-500 text-sm">
                        {getTransactionTypeText(transaction.type)} • {transaction.date}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text
                      className={`text-lg font-bold ${
                        transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </Text>
                    <br />
                    <Tag color="green">Hoàn thành</Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* Payment Methods */}
        <Card title="Phương Thức Thanh Toán" className="mb-8">
          <Row gutter={[16, 16]}>
            {paymentMethods.map((method, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="mb-3">{method.icon}</div>
                  <Title level={5} className="mb-2">{method.name}</Title>
                  <Text className="text-gray-600">{method.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Features */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="text-4xl mb-4">🔒</div>
              <Title level={4}>Bảo Mật Cao</Title>
              <Paragraph>
                Mã hóa 256-bit và xác thực 2 lớp để bảo vệ tài khoản của bạn
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="text-4xl mb-4">⚡</div>
              <Title level={4}>Nhanh Chóng</Title>
              <Paragraph>
                Giao dịch được xử lý ngay lập tức, không cần chờ đợi
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <div className="text-4xl mb-4">💰</div>
              <Title level={4}>Tiết Kiệm</Title>
              <Paragraph>
                Miễn phí giao dịch nội bộ và phí thấp cho giao dịch bên ngoài
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Deposit Modal */}
        <Modal
          title="Nạp Tiền Vào Ví"
          open={isDepositModalVisible}
          onCancel={() => setIsDepositModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleDeposit} layout="vertical">
            <Form.Item
              name="amount"
              label="Số tiền nạp"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <Input
                type="number"
                placeholder="Nhập số tiền"
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item
              name="method"
              label="Phương thức nạp"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}
            >
              <Select placeholder="Chọn phương thức nạp tiền">
                <Option value="bank">Chuyển khoản ngân hàng</Option>
                <Option value="card">Thẻ tín dụng/ghi nợ</Option>
                <Option value="mobile">Ví điện tử</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Nạp Tiền
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          title="Rút Tiền Từ Ví"
          open={isWithdrawModalVisible}
          onCancel={() => setIsWithdrawModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleWithdraw} layout="vertical">
            <Form.Item
              name="amount"
              label="Số tiền rút"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <Input
                type="number"
                placeholder="Nhập số tiền"
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item
              name="bankAccount"
              label="Tài khoản ngân hàng"
              rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
            >
              <Input placeholder="Nhập số tài khoản ngân hàng" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Rút Tiền
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default WalletPage;
