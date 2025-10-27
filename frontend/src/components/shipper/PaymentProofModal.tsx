import React, { useState } from 'react';
import { Modal, Upload, message } from 'antd';

interface PaymentProofModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({ visible, order, onClose, onSuccess }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      // Gọi API upload ảnh xác nhận giao hàng và cập nhật trạng thái
      const { ShipperService } = await import('../../services/shipper/shipperService');
      await ShipperService.updateDeliveryStatus(order.id, 'DELIVERED');
      message.success('Đã xác nhận giao hàng thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi xác nhận giao hàng');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Xác nhận giao hàng cho đơn #${order?.id}`}
      onCancel={onClose}
      onOk={handleUpload}
      okButtonProps={{ disabled: fileList.length === 0, loading: uploading }}
      okText="Xác nhận giao"
      cancelText="Hủy"
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
        accept="image/*"
        maxCount={1}
      >
        {fileList.length < 1 && '+ Upload'}
      </Upload>
      <p className="text-gray-500 text-sm mt-2">Vui lòng upload ảnh bằng chứng giao hàng (chữ ký, ảnh gói hàng, ...)</p>
    </Modal>
  );
};

export default PaymentProofModal; 