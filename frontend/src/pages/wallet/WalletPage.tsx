import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space, Row, Col, List, Tag, Spin } from 'antd';
import { 
  WalletOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  HistoryOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { WalletService } from '../../services/wallet/walletService';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

interface Transaction {
  id: number;
  type: string;
  status: string;
  amount: number;
  description?: string;
  createdAt: string;
}

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletData, transactionsData] = await Promise.all([
        WalletService.getWallet(),
        WalletService.getTransactions(1, 10),
      ]);
      setBalance(walletData.balance);
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'WITHDRAWAL': return <MinusOutlined style={{ color: '#ff4d4f' }} />;
      case 'PAYMENT': return <CreditCardOutlined style={{ color: '#1890ff' }} />;
      case 'REFUND': return <HistoryOutlined style={{ color: '#faad14' }} />;
      default: return <WalletOutlined />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'success';
      case 'WITHDRAWAL': return 'error';
      case 'PAYMENT': return 'processing';
      case 'REFUND': return 'warning';
      default: return 'default';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Nạp tiền';
      case 'WITHDRAWAL': return 'Rút tiền';
      case 'PAYMENT': return 'Thanh toán';
      case 'REFUND': return 'Hoàn tiền';
      case 'ADMIN_ADJUSTMENT': return 'Điều chỉnh';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Title level={1} className="flex items-center gap-3">
            <WalletOutlined className="text-blue-600" />
            Ví Tonic Store
          </Title>
          <Text className="text-gray-600">
            Quản lý số dư và giao dịch của bạn
          </Text>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="text-center sm:text-left">
                <Text className="text-white/80 text-lg">Số dư hiện tại</Text>
                <div className="text-4xl font-bold mt-2">
                  {formatPrice(balance)}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <Space className="w-full justify-center sm:justify-end">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/user/wallet/topup')}
                  className="bg-white text-blue-600 border-white hover:bg-gray-100"
                >
                  Nạp tiền
                </Button>
                <Button 
                  size="large" 
                  icon={<MinusOutlined />}
                  onClick={() => navigate('/user/wallet/withdraw')}
                  className="bg-white/20 text-white border-white hover:bg-white/30"
                >
                  Rút tiền
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="Giao dịch gần đây">
          <List
            dataSource={transactions}
            renderItem={(transaction) => (
              <List.Item>
                <List.Item.Meta
                  avatar={getTransactionIcon(transaction.type)}
                  title={
                    <Space>
                      <Text strong>{transaction.description || getTransactionLabel(transaction.type)}</Text>
                      <Tag color={getTransactionColor(transaction.type)}>
                        {getTransactionLabel(transaction.type)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space>
                      <Text type={transaction.amount > 0 ? 'success' : 'danger'}>
                        {transaction.amount > 0 ? '+' : ''}{formatPrice(transaction.amount)}
                      </Text>
                      <Text type="secondary">{new Date(transaction.createdAt).toLocaleString('vi-VN')}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có giao dịch nào
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
