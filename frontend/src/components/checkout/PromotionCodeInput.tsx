import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useLocation } from 'react-router-dom';
import { message, Space, Typography, Card, List, Radio } from 'antd';
import { PromotionService } from '../../services/discount-codes/discountCodeService';

const { Text } = Typography;

interface PromotionCodeInputProps {
  orderValue: number;
  onDiscountApplied: (discountAmount: number, finalPrice: number, code?: string) => void;
}

export interface PromotionCodeInputRef {
  clearAppliedCode: () => void;
  refreshClaimedCodes: () => void;
}

const PromotionCodeInput = forwardRef<PromotionCodeInputRef, PromotionCodeInputProps>(({ orderValue, onDiscountApplied }, ref) => {
  const [claimedCodes, setClaimedCodes] = useState<Record<string, any>[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const location = useLocation();

  useImperativeHandle(ref, () => ({
    clearAppliedCode: () => {
      setSelectedCode(null);
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
    },
    refreshClaimedCodes: () => {
      fetchClaimedCodes();
      // Reset selected code khi refresh
      setSelectedCode(null);
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
    }
  }));

  // Fetch danh sách mã mỗi khi component mount hoặc location thay đổi
  useEffect(() => {
    fetchClaimedCodes();
    // Reset selected code khi component mount lại
    setSelectedCode(null);
    setDiscountAmount(0);
    onDiscountApplied(0, orderValue, undefined);
  }, [location.pathname]); // Refresh khi route thay đổi (ví dụ quay lại checkout)

  const fetchClaimedCodes = async () => {
    try {
      const codes = await PromotionService.getClaimedPromotionCodes();
      console.log('Fetched claimed codes:', codes);
      // Filter ra các mã đã dùng (nếu có) - backup check
      // Backend đã filter rồi nhưng để đảm bảo an toàn
      setClaimedCodes(codes);
    } catch (error) {
      console.error('Error fetching claimed codes:', error);
      setClaimedCodes([]);
    }
  };

  const handleSelectCode = async (codeToUse: string) => {
    if (!codeToUse) {
      setSelectedCode(null);
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
      return;
    }

    // Kiểm tra mã có trong danh sách claimed codes không (safety check)
    const codeExists = claimedCodes.some(code => code.code === codeToUse);
    if (!codeExists) {
      message.error('Mã giảm giá không có trong danh sách mã đã nhận');
      setSelectedCode(null);
      return;
    }

    setSelectedCode(codeToUse);
    try {
      const result = await PromotionService.applyPromotionCode(codeToUse, orderValue);
      if (result.isValid && result.discountCode && result.discountAmount) {
        setDiscountAmount(result.discountAmount);
        onDiscountApplied(result.discountAmount, orderValue - result.discountAmount, codeToUse);
        message.success('Áp dụng mã giảm giá thành công!');
      } else {
        setSelectedCode(null);
        setDiscountAmount(0);
        onDiscountApplied(0, orderValue, undefined);
        message.error(result.message || 'Mã giảm giá không hợp lệ');
        // Refresh danh sách nếu mã không hợp lệ (có thể đã bị dùng)
        await fetchClaimedCodes();
      }
    } catch (error) {
      setSelectedCode(null);
      setDiscountAmount(0);
      onDiscountApplied(0, orderValue, undefined);
      const errorMessage = error instanceof Error ? error.message : 'Không thể áp dụng mã giảm giá';
      message.error(errorMessage);
      
      // Nếu lỗi là "đã sử dụng mã này rồi", refresh danh sách để cập nhật
      if (errorMessage.includes('đã sử dụng') || errorMessage.includes('đã dùng')) {
        await fetchClaimedCodes();
      }
    }
  };

  return (
    <Card className="mb-4">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Nhận mã giảm giá</Text>
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