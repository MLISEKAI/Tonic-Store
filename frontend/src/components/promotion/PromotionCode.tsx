import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message, List, Tag, Modal, Typography } from 'antd';
import { CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PromotionService } from '../../services/promotion/promotionService';
import type { PromotionCode } from '../../services/promotion/promotionService';

const { Text } = Typography;

const PromotionCode: React.FC = () => {
  const [promotionCodes, setPromotionCodes] = useState<PromotionCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState<PromotionCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPromotionCodes = async () => {
    try {
      setLoading(true);
      const data = await PromotionService.getAvailablePromotionCodes();
      setPromotionCodes(data);
    } catch (error) {
      console.error('Error fetching promotion codes:', error);
      message.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionCodes();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Đã sao chép mã giảm giá!');
  };

  const handleViewDetails = async (code: PromotionCode) => {
    try {
      const details = await PromotionService.getPromotionCodeDetails(code.code);
      setSelectedCode(details);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể lấy thông tin chi tiết mã giảm giá');
    }
  };

  const formatDiscount = (code: PromotionCode) => {
    if (code.type === 'PERCENTAGE') {
      return `${code.discount}%`;
    }
    return `${code.discount.toLocaleString('vi-VN')}đ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mã Giảm Giá</h1>
      
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
                  key="copy"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyCode(code.code)}
                >
                  Sao chép
                </Button>,
                <Button
                  key="details"
                  type="primary"
                  onClick={() => handleViewDetails(code)}
                >
                  Chi tiết
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
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedCode && (
          <div className="space-y-4">
            <p><strong>Mã:</strong> {selectedCode.code}</p>
            <p><strong>Giảm giá:</strong> {formatDiscount(selectedCode)}</p>
            <p><strong>Đơn hàng tối thiểu:</strong> {selectedCode.minOrderValue?.toLocaleString('vi-VN')}đ</p>
            {selectedCode.maxDiscount && (
              <p><strong>Giảm tối đa:</strong> {selectedCode.maxDiscount.toLocaleString('vi-VN')}đ</p>
            )}
            <p><strong>Ngày bắt đầu:</strong> {formatDate(selectedCode.startDate)}</p>
            <p><strong>Ngày kết thúc:</strong> {formatDate(selectedCode.endDate)}</p>
            <div className="mt-4">
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => handleCopyCode(selectedCode.code)}
                block
              >
                Sao chép mã
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PromotionCode; 