import React, { useState, useEffect } from 'react';
import { Card, Button, message, List, Tag, Modal, Spin } from 'antd';
import { GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PromotionService } from '../services/discount-codes/discountCodeService';
import type { PromotionCode } from '../services/discount-codes/discountCodeService';
import { formatDate } from '../utils/dateUtils';

const PromotionCode: React.FC = () => {
  const [promotionCodes, setPromotionCodes] = useState<PromotionCode[]>([]);
  const [claimedCodes, setClaimedCodes] = useState<PromotionCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<PromotionCode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPromotionCodes = async () => {
    try {
      setLoading(true);
      const [availableCodes, claimedCodes] = await Promise.all([
        PromotionService.getAvailablePromotionCodes(),
        PromotionService.getClaimedPromotionCodes()
      ]);
      setPromotionCodes(availableCodes);
      setClaimedCodes(claimedCodes);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách mã giảm giá');
      console.error('Error loading promotion codes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionCodes();
  }, []);

  const handleViewCode = (code: PromotionCode) => {
    setSelectedCode(code);
    setIsModalVisible(true);
  };

  const handleApplyCode = async (code: string) => {
    try {
      if (!code) {
        message.error('Mã giảm giá không được để trống');
        return;
      }

      // Kiểm tra xem mã có hợp lệ không
      const result = await PromotionService.claimPromotionCode(code);
      
      if (!result.isValid) {
        message.error(result.message || 'Mã giảm giá không hợp lệ');
        return;
      }

      if (!result.discountCode) {
        message.error('Không thể lấy thông tin mã giảm giá');
        return;
      }

      setClaimedCodes(prev => [...prev, result.discountCode!]);

      message.success('Đã nhận mã giảm giá thành công!');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error applying code:', error);
      message.error('Không thể nhận mã giảm giá');
    }
  };

  const formatDiscount = (code: PromotionCode) => {
    if (!code || typeof code.discount === 'undefined') return '0';
    if (code.type === 'PERCENTAGE') {
      return `${code.discount}%`;
    }
    return `${code.discount.toLocaleString('vi-VN')}đ`;
  };

  const renderCodeDetails = (code: PromotionCode) => (
    <div className="space-y-2">
      <p><strong>Mã:</strong> {code.code}</p>
      <p><strong>Giảm giá:</strong> {formatDiscount(code)}</p>
      <p><strong>Đơn hàng tối thiểu:</strong> {code.minOrderValue?.toLocaleString('vi-VN')}đ</p>
      <p><strong>Hạn sử dụng:</strong> {formatDate(code.endDate)}</p>
      <p><strong>Điều kiện sử dụng:</strong></p>
      <ul className="list-disc pl-5">
        <li>Mỗi người dùng chỉ được sử dụng một lần</li>
        <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
        <li>Không có giá trị quy đổi thành tiền mặt</li>
        <li>Áp dụng cho đơn hàng từ {code.minOrderValue?.toLocaleString('vi-VN')}đ</li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (promotionCodes.length === 0) {
    return <div className="text-center py-4">Hiện không có mã giảm giá nào</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mã Giảm Giá</h1>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
        dataSource={promotionCodes}
        loading={loading}
        renderItem={(code) => (
          <List.Item>
            <Card
              className="hover:shadow-lg transition-shadow"
              actions={[
                <Button
                  key="view"
                  icon={<InfoCircleOutlined />}
                  onClick={() => handleViewCode(code)}
                >
                  Chi tiết
                </Button>,
                <Button
                  key="apply"
                  type="primary"
                  icon={<GiftOutlined />}
                  onClick={() => handleApplyCode(code.code)}
                  disabled={claimedCodes.some(c => c.id === code.id)}
                >
                  {claimedCodes.some(c => c.id === code.id) ? 'Đã nhận' : 'Nhận mã'}
                </Button>
              ]}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{code.code}</h3>
                <Tag color="green" className="text-lg mb-2">
                  Giảm {formatDiscount(code)}
                </Tag>
                <p className="text-gray-600">
                  Áp dụng cho đơn hàng từ {code.minOrderValue?.toLocaleString('vi-VN')}đ
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  HSD: {formatDate(code.endDate)}
                </p>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Chi tiết mã giảm giá"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          selectedCode && (
            <Button
              key="apply"
              type="primary"
              icon={<GiftOutlined />}
              onClick={() => {
                handleApplyCode(selectedCode.code);
                setIsModalVisible(false);
              }}
              disabled={claimedCodes.some(c => c.id === selectedCode.id)}
            >
              {claimedCodes.some(c => c.id === selectedCode.id) ? 'Đã nhận' : 'Nhận mã'}
            </Button>
          )
        ]}
      >
        {selectedCode && renderCodeDetails(selectedCode)}
      </Modal>
    </div>

  );
};

export default PromotionCode; 