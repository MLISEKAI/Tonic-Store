import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, message, Space, Typography, Card, List, Radio } from 'antd';
import { GiftOutlined, DeleteOutlined } from '@ant-design/icons';
import { PromotionService } from '../../services/discount-codes/discountCodeService';

const { Text } = Typography;

interface PromotionCodeInputProps {
  orderValue: number;
  onDiscountApplied: (discountAmount: number, finalPrice: number, code?: string) => void;
}

export interface PromotionCodeInputRef {
  clearAppliedCode: () => void;
}

const PromotionCodeInput = forwardRef<PromotionCodeInputRef, PromotionCodeInputProps>(({ orderValue, onDiscountApplied }, ref) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimedCodes, setClaimedCodes] = useState<any[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useImperativeHandle(ref, () => ({
    clearAppliedCode: () => {
      setSelectedCode(null);
      setDiscountAmount(0);
      setCode('');
      onDiscountApplied(0, orderValue, undefined);
    }
  }));

  useEffect(() => {
    fetchClaimedCodes();
  }, []);

  const fetchClaimedCodes = async () => {
    try {
      const codes = await PromotionService.getClaimedPromotionCodes();
      setClaimedCodes(codes);
    } catch (error) {
      console.error('Error fetching claimed codes:', error);
    }
  };

  const handleReceiveCode = async () => {
    if (!code.trim()) {
      message.warning('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      setLoading(true);
      const result = await PromotionService.claimPromotionCode(code.trim());
      if (result.isValid) {
        message.success('Đã nhận mã giảm giá thành công!');
        setCode('');
        // Refresh danh sách mã đã nhận
        await fetchClaimedCodes();
      } else {
        message.error(result.message || 'Không thể nhận mã giảm giá');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể nhận mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCode = async (codeToUse: string) => {
    setSelectedCode(codeToUse);
    if (!codeToUse) {
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
      return;
    }
    try {
      setLoading(true);
      const result = await PromotionService.applyPromotionCode(codeToUse, orderValue);
      if (result.isValid && result.discountCode && result.discountAmount) {
        setDiscountAmount(result.discountAmount);
        onDiscountApplied(result.discountAmount, orderValue - result.discountAmount, codeToUse);
        message.success('Áp dụng mã giảm giá thành công!');
      } else {
        setDiscountAmount(0);
        onDiscountApplied(0, orderValue, undefined);
        message.error(result.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
      message.error(error instanceof Error ? error.message : 'Không thể áp dụng mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Nhận mã giảm giá</Text>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Nhập mã giảm giá"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            type="primary"
            icon={<GiftOutlined />}
            onClick={handleReceiveCode}
            loading={loading}
          >
            Nhận mã
          </Button>
        </Space.Compact>
        {claimedCodes.length > 0 && (
          <>
            <Text strong>Chọn mã để áp dụng:</Text>
            <Radio.Group
              value={selectedCode}
              onChange={e => handleSelectCode(e.target.value)}
              style={{ width: '100%' }}
            >
              <List
                dataSource={claimedCodes}
                renderItem={item => (
                  <List.Item>
                    <Radio value={item.code}>
                      <Space direction="vertical" size={0}>
                        <Text>{item.code}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.description}
                        </Text>
                      </Space>
                    </Radio>
                  </List.Item>
                )}
              />
            </Radio.Group>
          </>
        )}
        {selectedCode && discountAmount > 0 && (
          <div className="mt-2">
            <Text type="success">Đã áp dụng mã giảm giá: {selectedCode}</Text>
            <div className="mt-1">
              <Text strong>Số tiền được giảm: </Text>
              <Text type="danger" strong>
                {discountAmount.toLocaleString('vi-VN')}đ
              </Text>
            </div>
            <div>
              <Text strong>Giá sau khi giảm: </Text>
              <Text type="danger" strong>
                {(orderValue - discountAmount).toLocaleString('vi-VN')}đ
              </Text>
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
});

export default PromotionCodeInput; 