import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Row, Col, List, Tag, Modal, Input, Form, message } from 'antd';
import { 
  WalletOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  HistoryOutlined, 
  CreditCardOutlined,
  BankOutlined,
  QrcodeOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [depositForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    setBalance(1250000); // 1.25M VND
    setTransactions([
      {
        id: '1',
        type: 'deposit',
        amount: 500000,
        description: 'Nạp tiền từ ngân hàng Vietcombank',
        date: '2024-01-15 14:30',
        status: 'completed'
      },
      {
        id: '2',
        type: 'payment',
        amount: -250000,
        description: 'Thanh toán đơn hàng #12345',
        date: '2024-01-14 09:15',
        status: 'completed'
      },
      {
        id: '3',
        type: 'refund',
        amount: 150000,
        description: 'Hoàn tiền đơn hàng #12340',
        date: '2024-01-13 16:45',
        status: 'completed'
      },
      {
        id: '4',
        type: 'withdraw',
        amount: -100000,
        description: 'Rút tiền về ngân hàng',
        date: '2024-01-12 11:20',
        status: 'pending'
      }
    ]);
  }, []);

  const handleDeposit = async (values: { amount: number; method: string }) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(prev => prev + values.amount);
      message.success('Nạp tiền thành công!');
      setDepositModalVisible(false);
      depositForm.resetFields();
    } catch (error) {
      message.error('Nạp tiền thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (values: { amount: number; bankAccount: string }) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(prev => prev - values.amount);
      message.success('Yêu cầu rút tiền đã được gửi!');
      setWithdrawModalVisible(false);
      withdrawForm.resetFields();
    } catch (error) {
      message.error('Rút tiền thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'withdraw': return <MinusOutlined style={{ color: '#ff4d4f' }} />;
      case 'payment': return <CreditCardOutlined style={{ color: '#1890ff' }} />;
      case 'refund': return <HistoryOutlined style={{ color: '#faad14' }} />;
      default: return <WalletOutlined />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'withdraw': return 'error';
      case 'payment': return 'processing';
      case 'refund': return 'warning';
      default: return 'default';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Title level={2}>Vui lòng đăng nhập để sử dụng ví</Title>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="flex items-center gap-3">
            <WalletOutlined className="text-blue-600" />
            Ví Tonic Store
          </Title>
          <Text className="text-gray-600">
            Quản lý số dư và giao dịch của bạn
          </Text>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="text-center sm:text-left">
                <Text className="text-white/80 text-lg">Số dư hiện tại</Text>
                <div className="text-4xl font-bold mt-2">
                  {formatAmount(balance)}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <Space className="w-full justify-center sm:justify-end">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  onClick={() => setDepositModalVisible(true)}
                  className="bg-white text-blue-600 border-white hover:bg-gray-100"
                >
                  Nạp tiền
                </Button>
                <Button 
                  size="large" 
                  icon={<MinusOutlined />}
                  onClick={() => setWithdrawModalVisible(true)}
                  className="bg-white/20 text-white border-white hover:bg-white/30"
                >
                  Rút tiền
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <QrcodeOutlined className="text-2xl text-blue-600 mb-2" />
              <Text strong>QR Code</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <BankOutlined className="text-2xl text-green-600 mb-2" />
              <Text strong>Liên kết ngân hàng</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <HistoryOutlined className="text-2xl text-orange-600 mb-2" />
              <Text strong>Lịch sử giao dịch</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <SecurityScanOutlined className="text-2xl text-red-600 mb-2" />
              <Text strong>Bảo mật</Text>
            </Card>
          </Col>
        </Row>

        {/* Recent Transactions */}
        <Card>
          <Title level={3} className="mb-4">Giao dịch gần đây</Title>
          <List
            dataSource={transactions}
            renderItem={(transaction) => (
              <List.Item>
                <List.Item.Meta
                  avatar={getTransactionIcon(transaction.type)}
                  title={
                    <Space>
                      <Text strong>{transaction.description}</Text>
                      <Tag color={getTransactionColor(transaction.type)}>
                        {transaction.status}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space>
                      <Text type={transaction.amount > 0 ? 'success' : 'danger'}>
                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                      </Text>
                      <Text type="secondary">{transaction.date}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Deposit Modal */}
        <Modal
          title="Nạp tiền vào ví"
          open={depositModalVisible}
          onCancel={() => setDepositModalVisible(false)}
          footer={null}
        >
          <Form
            form={depositForm}
            onFinish={handleDeposit}
            layout="vertical"
          >
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
              label="Phương thức nạp tiền"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}
            >
              <Input placeholder="Chuyển khoản ngân hàng" disabled />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-end">
                <Button onClick={() => setDepositModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Nạp tiền
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          title="Rút tiền từ ví"
          open={withdrawModalVisible}
          onCancel={() => setWithdrawModalVisible(false)}
          footer={null}
        >
          <Form
            form={withdrawForm}
            onFinish={handleWithdraw}
            layout="vertical"
          >
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
              <Space className="w-full justify-end">
                <Button onClick={() => setWithdrawModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Rút tiền
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default WalletPage;
