import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';

interface FailedDeliveryModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FailedDeliveryModal: React.FC<FailedDeliveryModalProps> = ({ visible, order, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Gọi API cập nhật lý do giao không thành công và cập nhật trạng thái
      const { ShipperService } = await import('../../services/shipper/shipperService');
      await ShipperService.updateDeliveryStatus(order.id, 'CANCELLED', reason);
      message.success('Đã gửi lý do giao không thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi gửi lý do');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Lý do không giao được đơn #${order?.id}`}
      onCancel={onClose}
      onOk={handleSubmit}
      okButtonProps={{ disabled: !reason, loading }}
      okText="Gửi lý do"
      cancelText="Hủy"
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập lý do không giao được (khách vắng mặt, sai địa chỉ, ... )"
        value={reason}
        onChange={e => setReason(e.target.value)}
      />
    </Modal>
  );
};

export default FailedDeliveryModal; 