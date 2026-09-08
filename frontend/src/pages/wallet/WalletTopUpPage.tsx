import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Radio,
  Modal,
  message,
  Spin,
  Descriptions,
  Tag,
  Divider,
} from 'antd';
import {
  WalletOutlined,
  PlusOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { TopUpPackageService, PaymentGatewayService } from '../../services/wallet/paymentGatewayService';
import { WalletService } from '../../services/wallet/walletService';
import { PaymentGateway, TopUpPackage as TopUpPackageType } from '../../types';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const PaymentGatewaySimulation: React.FC<{
  visible: boolean;
  gateway: PaymentGateway;
  amount: number;
  packageName?: string;
  transactionId: number;
  onClose: () => void;
  onSuccess: () => void;
  onFail: () => void;
}> = ({ visible, gateway, amount, packageName, transactionId, onClose, onSuccess, onFail }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (visible) {
      setStep(0);
      setLoading(true);
      
      const timer = setTimeout(() => {
        setLoading(false);
        setStep(1);
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          JSON.stringify({
            gateway,
            amount,
            packageName,
            transactionId,
            timestamp: Date.now(),
          })
        )}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [visible, gateway, amount, packageName, transactionId]);

  const handleSimulateSuccess = async () => {
    setLoading(true);
    try {
      await PaymentGatewayService.completePayment(transactionId);
      message.success('Nạp tiền thành công!');
      onSuccess();
    } catch {
      message.error('Nạp tiền thất bại!');
      onFail();
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFail = async () => {
    setLoading(true);
    try {
      await PaymentGatewayService.failPayment(transactionId, 'User cancelled or payment failed');
      message.error('Thanh toán thất bại!');
      onFail();
    } catch {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const getGatewayName = () => {
    switch (gateway) {
      case PaymentGateway.ZALO_PAY: return 'Zalo Pay';
      case PaymentGateway.MOMO: return 'MoMo';
      case PaymentGateway.PAYPAL: return 'PayPal';
      case PaymentGateway.BANK_TRANSFER: return 'Chuyển khoản ngân hàng';
      case PaymentGateway.VN_PAY: return 'VNPay';
      default: return gateway;
    }
  };

  const getGatewayColor = () => {
    switch (gateway) {
      case PaymentGateway.ZALO_PAY: return '#0068FF';
      case PaymentGateway.MOMO: return '#FF006E';
      case PaymentGateway.PAYPAL: return '#003087';
      case PaymentGateway.BANK_TRANSFER: return '#00A86B';
      case PaymentGateway.VN_PAY: return '#0070C0';
      default: return '#1890ff';
    }
  };

  const renderGatewayContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: getGatewayColor() }} spin />} />
          <Text className="mt-4 block">Đang kết nối với {getGatewayName()}...</Text>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div>
          <div className="text-center mb-6">
            <Title level={4}>{getGatewayName()}</Title>
            <Text type="secondary">Quét mã QR hoặc thanh toán trực tiếp</Text>
          </div>
          
          <Card className="mb-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: getGatewayColor() }}>
              {formatPrice(amount)}
            </div>
            {packageName && <Text type="secondary">Gói: {packageName}</Text>}
            <Divider />
            <div className="flex justify-center">
              <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
            </div>
            <Text type="secondary" className="text-xs">
              Mã giao dịch: {transactionId}
            </Text>
          </Card>

          <Descriptions column={1} size="small" className="mb-6">
            <Descriptions.Item label="Phương thức">{getGatewayName()}</Descriptions.Item>
            <Descriptions.Item label="Số tiền">{formatPrice(amount)}</Descriptions.Item>
            {packageName && <Descriptions.Item label="Gói nạp">{packageName}</Descriptions.Item>}
            <Descriptions.Item label="Trạng thái">
              <Tag color="processing">Đang xử lý</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Space className="w-full justify-between">
            <Button onClick={onClose} icon={<ArrowLeftOutlined />}>
              Hủy
            </Button>
            <Space>
              <Button onClick={handleSimulateFail} icon={<CloseCircleOutlined />}>
                Mô phỏng thất bại
              </Button>
              <Button type="primary" onClick={handleSimulateSuccess} icon={<CheckCircleOutlined />}>
                Mô phỏng thành công
              </Button>
            </Space>
          </Space>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: getGatewayColor() }} />
          Thanh toán qua {getGatewayName()}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      {renderGatewayContent()}
    </Modal>
  );
};

const WalletTopUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [packages, setPackages] = useState<TopUpPackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackageType | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(PaymentGateway.ZALO_PAY);
  const [gatewayModalVisible, setGatewayModalVisible] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<number | null>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    fetchPackages();
    fetchWallet();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await TopUpPackageService.getActive();
      setPackages(data);
    } catch {
      message.error('Không thể tải danh sách gói nạp tiền');
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const data = await WalletService.getWallet();
      setWallet(data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleSelectPackage = (pkg: TopUpPackageType) => {
    setSelectedPackage(pkg);
    setGatewayModalVisible(true);
  };

  const handleGatewayPayment = async () => {
    if (!selectedPackage) return;

    try {
      const result = await PaymentGatewayService.createDeposit(
        selectedPackage.amount,
        selectedGateway,
        selectedPackage.name
      );
      setCurrentTransactionId(result.transaction.id);
      message.success('Đã tạo yêu cầu thanh toán');
    } catch {
      message.error('Không thể tạo yêu cầu thanh toán');
      setGatewayModalVisible(false);
    }
  };

  const handlePaymentSuccess = () => {
    setGatewayModalVisible(false);
    setSelectedPackage(null);
    setCurrentTransactionId(null);
    fetchWallet();
    message.success('Nạp tiền thành công!');
  };

  const handlePaymentFail = () => {
    setGatewayModalVisible(false);
    setSelectedPackage(null);
    setCurrentTransactionId(null);
    message.error('Thanh toán thất bại!');
  };

  const gateways = [
    { value: PaymentGateway.ZALO_PAY, label: 'Zalo Pay', color: '#0068FF', icon: '💙' },
    { value: PaymentGateway.MOMO, label: 'MoMo', color: '#FF006E', icon: '💳' },
    { value: PaymentGateway.PAYPAL, label: 'PayPal', color: '#003087', icon: '🅿️' },
    { value: PaymentGateway.BANK_TRANSFER, label: 'Chuyển khoản ngân hàng', color: '#00A86B', icon: '🏦' },
  ];

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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/user/wallet')} className="mb-4">
            Quay lại ví
          </Button>
          <Title level={1} className="flex items-center gap-3">
            <WalletOutlined className="text-blue-600" />
            Nạp tiền vào ví
          </Title>
          <Text className="text-gray-600">
            Chọn gói nạp tiền và phương thức thanh toán để mở khóa nội dung
          </Text>
        </div>

        {wallet && (
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="text-center sm:text-left">
                  <Text className="text-white/80 text-lg">Số dư hiện tại</Text>
                  <div className="text-4xl font-bold mt-2">
                    {formatPrice(wallet.balance)}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Space className="w-full justify-center sm:justify-end">
                  <Button 
                    size="large" 
                    icon={<PlusOutlined />}
                    className="bg-white text-blue-600 border-white hover:bg-gray-100"
                  >
                    Nạp tiền ngay
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

        <Card title="Chọn gói nạp tiền" className="mb-6">
          <Row gutter={[16, 16]}>
            {packages.map((pkg) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
                <Card
                  hoverable
                  className={`text-center h-full ${selectedPackage?.id === pkg.id ? 'border-blue-500 border-2' : ''}`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {pkg.icon && <div className="text-4xl mb-2">{pkg.icon}</div>}
                  <Title level={4} className="mb-1">{pkg.name}</Title>
                  {pkg.description && <Text type="secondary" className="text-sm block mb-2">{pkg.description}</Text>}
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatPrice(pkg.amount)}
                  </div>
                  {pkg.bonusAmount && pkg.bonusAmount > 0 && (
                    <Tag color="orange" className="mb-2">+ {formatPrice(pkg.bonusAmount)} thưởng</Tag>
                  )}
                  <div className="text-sm text-gray-500">
                    {pkg.amount >= 1000000 
                      ? `${(pkg.amount / 1000000).toFixed(1)} triệu VND`
                      : `${(pkg.amount / 1000).toFixed(0)}K VND`
                    }
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {selectedPackage && (
          <Card title="Chọn phương thức thanh toán" className="mb-6">
            <Radio.Group 
              value={selectedGateway} 
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="w-full"
            >
              <Row gutter={[16, 16]}>
                {gateways.map((gw) => (
                  <Col xs={24} sm={12} md={8} key={gw.value}>
                    <Card 
                      size="small" 
                      hoverable
                      className={`text-center ${selectedGateway === gw.value ? 'border-blue-500 border-2' : ''}`}
                      onClick={() => setSelectedGateway(gw.value)}
                    >
                      <Radio value={gw.value} className="w-full">
                        <Space className="text-lg">
                          <span>{gw.icon}</span>
                          <span style={{ color: gw.color }}>{gw.label}</span>
                        </Space>
                      </Radio>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Radio.Group>

            <div className="mt-6 text-center">
              <Button 
                type="primary" 
                size="large" 
                icon={<QrcodeOutlined />}
                onClick={handleGatewayPayment}
                className="min-w-[200px]"
              >
                Thanh toán {formatPrice(selectedPackage.amount)}
              </Button>
            </div>
          </Card>
        )}

        <PaymentGatewaySimulation
          visible={gatewayModalVisible}
          gateway={selectedGateway}
          amount={selectedPackage?.amount || 0}
          packageName={selectedPackage?.name}
          transactionId={currentTransactionId || 0}
          onClose={() => setGatewayModalVisible(false)}
          onSuccess={handlePaymentSuccess}
          onFail={handlePaymentFail}
        />
      </div>
    </div>
  );
};

export default WalletTopUpPage;
