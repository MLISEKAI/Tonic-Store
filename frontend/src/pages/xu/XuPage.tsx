import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, List, Tag, Modal, Form, Select, Alert } from 'antd';
import { 
  GiftOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  HistoryOutlined,
  QrcodeOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const XuPage: React.FC = () => {
  const { user } = useAuth();

  const [isConvertModalVisible, setIsConvertModalVisible] = useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [form] = Form.useForm();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Title level={2}>Vui lòng đăng nhập để sử dụng Tonic Xu</Title>
        </div>
      </div>
    );
  }

  // Mock data
  const tonicXu = 15000;
  const xuHistory = [
    {
      id: 1,
      type: 'earn',
      amount: 500,
      description: 'Mua hàng đơn #12345',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'redeem',
      amount: -200,
      description: 'Đổi voucher giảm giá 10%',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'earn',
      amount: 1000,
      description: 'Đánh giá sản phẩm',
      date: '2024-01-13',
      status: 'completed',
    },
    {
      id: 4,
      type: 'bonus',
      amount: 2000,
      description: 'Thưởng sinh nhật',
      date: '2024-01-12',
      status: 'completed',
    },
  ];

  const rewards = [
    {
      id: 1,
      name: 'Voucher giảm giá 10%',
      cost: 200,
      description: 'Giảm 10% cho đơn hàng từ 500.000đ',
      image: 'https://img.freepik.com/premium-photo/discount-voucher_136595-1234.jpg',
      category: 'voucher',
    },
    {
      id: 2,
      name: 'Voucher giảm giá 20%',
      cost: 500,
      description: 'Giảm 20% cho đơn hàng từ 1.000.000đ',
      image: 'https://img.freepik.com/premium-photo/discount-voucher_136595-5678.jpg',
      category: 'voucher',
    },
    {
      id: 3,
      name: 'Miễn phí vận chuyển',
      cost: 100,
      description: 'Miễn phí vận chuyển cho đơn hàng tiếp theo',
      image: 'https://img.freepik.com/premium-photo/free-shipping_136595-9012.jpg',
      category: 'shipping',
    },
    {
      id: 4,
      name: 'Tích điểm x2',
      cost: 300,
      description: 'Tích điểm gấp đôi trong 7 ngày',
      image: 'https://img.freepik.com/premium-photo/double-points_136595-3456.jpg',
      category: 'bonus',
    },
  ];

  const earnMethods = [
    {
      method: 'Mua hàng',
      rate: '1 Xu = 1.000đ',
      description: 'Tích Xu khi mua hàng trên Tonic Store',
      icon: '🛒',
    },
    {
      method: 'Đánh giá sản phẩm',
      rate: '50-100 Xu',
      description: 'Viết đánh giá chi tiết cho sản phẩm',
      icon: '⭐',
    },
    {
      method: 'Chia sẻ sản phẩm',
      rate: '20 Xu',
      description: 'Chia sẻ sản phẩm lên mạng xã hội',
      icon: '📱',
    },
    {
      method: 'Mời bạn bè',
      rate: '500 Xu',
      description: 'Mời bạn bè đăng ký và mua hàng',
      icon: '👥',
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <PlusOutlined className="text-green-500" />;
      case 'redeem':
        return <MinusOutlined className="text-red-500" />;
      case 'bonus':
        return <GiftOutlined className="text-blue-500" />;
      default:
        return <StarOutlined className="text-gray-500" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'earn':
        return 'Tích Xu';
      case 'redeem':
        return 'Đổi Xu';
      case 'bonus':
        return 'Thưởng Xu';
      default:
        return 'Giao dịch';
    }
  };

  const handleConvert = (values: any) => {
    console.log('Convert values:', values);
    setIsConvertModalVisible(false);
    form.resetFields();
  };

  const handleRedeem = (values: any) => {
    console.log('Redeem values:', values);
    setIsRedeemModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Tonic Xu
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Hệ thống tích điểm và đổi thưởng của Tonic Store
          </Paragraph>
        </div>

        {/* Balance Card */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={12}>
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-yellow-100">Số dư Tonic Xu</Text>
                  <Title level={2} className="text-white mb-0">
                    {tonicXu.toLocaleString()} Xu
                  </Title>
                  <Text className="text-yellow-100">
                    Tương đương {formatCurrency(tonicXu * 1000)}
                  </Text>
                </div>
                <StarOutlined className="text-6xl text-yellow-200" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-purple-100">Cấp độ thành viên</Text>
                  <Title level={2} className="text-white mb-0">
                    Gold
                  </Title>
                  <Text className="text-purple-100">
                    Còn 5.000 Xu để lên Platinum
                  </Text>
                </div>
                <TrophyOutlined className="text-6xl text-purple-200" />
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
              onClick={() => setIsConvertModalVisible(true)}
            >
              Đổi Xu
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              size="large"
              icon={<GiftOutlined />}
              block
              onClick={() => setIsRedeemModalVisible(true)}
            >
              Đổi Thưởng
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

        {/* Earn Methods */}
        <div className="mb-8">
          <Title level={2} className="text-center mb-8">Cách Tích Xu</Title>
          <Row gutter={[24, 24]}>
            {earnMethods.map((method, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <Title level={4} className="mb-2">{method.method}</Title>
                  <Text strong className="text-blue-600 block mb-2">{method.rate}</Text>
                  <Paragraph className="text-gray-600">{method.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Rewards */}
        <div className="mb-8">
          <Title level={2} className="text-center mb-8">Đổi Thưởng</Title>
          <Row gutter={[24, 24]}>
            {rewards.map((reward) => (
              <Col xs={24} sm={12} lg={6} key={reward.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={reward.name}
                      src={reward.image}
                      className="h-32 object-cover"
                    />
                  }
                  className="h-full"
                >
                  <div className="p-2">
                    <Title level={5} className="mb-2">{reward.name}</Title>
                    <Paragraph className="text-gray-600 mb-3">
                      {reward.description}
                    </Paragraph>
                    <div className="flex items-center justify-between">
                      <Tag color="orange">{reward.cost} Xu</Tag>
                      <Button type="primary" size="small">
                        Đổi Ngay
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Transaction History */}
        <Card title="Lịch Sử Giao Dịch Xu" className="mb-8">
          <List
            dataSource={xuHistory}
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
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} Xu
                    </Text>
                    <br />
                    <Tag color="green">Hoàn thành</Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* Convert Modal */}
        <Modal
          title="Đổi Tiền Thành Xu"
          open={isConvertModalVisible}
          onCancel={() => setIsConvertModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleConvert} layout="vertical">
            <Form.Item
              name="amount"
              label="Số tiền muốn đổi"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
              <Input
                type="number"
                placeholder="Nhập số tiền"
                addonAfter="VND"
              />
            </Form.Item>
            <Alert
              message="Tỷ lệ đổi"
              description="1.000 VND = 1 Xu. Số Xu nhận được sẽ được làm tròn xuống."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đổi Xu
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Redeem Modal */}
        <Modal
          title="Đổi Xu Lấy Thưởng"
          open={isRedeemModalVisible}
          onCancel={() => setIsRedeemModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleRedeem} layout="vertical">
            <Form.Item
              name="reward"
              label="Chọn phần thưởng"
              rules={[{ required: true, message: 'Vui lòng chọn phần thưởng' }]}
            >
              <Select placeholder="Chọn phần thưởng muốn đổi">
                {rewards.map(reward => (
                  <Option key={reward.id} value={reward.id}>
                    {reward.name} - {reward.cost} Xu
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đổi Thưởng
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default XuPage;
