import React, { useState } from 'react';
import { Modal, Checkbox, Button, message } from 'antd';

interface DeliveryChecklistModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

const checklistItems = [
  'Đã gọi khách',
  'Đã thu tiền',
  'Khách đã nhận',
];

const DeliveryChecklistModal: React.FC<DeliveryChecklistModalProps> = ({ visible, order, onClose, onSuccess }) => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    // Gọi API xác nhận checklist giao hàng
    setTimeout(() => {
      setLoading(false);
      message.success('Đã xác nhận checklist giao hàng!');
      onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      title={`Checklist giao hàng đơn #${order?.id}`}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: checkedList.length < checklistItems.length, loading }}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Checkbox.Group
        options={checklistItems}
        value={checkedList}
        onChange={list => setCheckedList(list as string[])}
      />
      <p className="text-gray-500 text-sm mt-2">Vui lòng xác nhận đủ các bước trước khi giao hàng.</p>
    </Modal>
  );
};

export default DeliveryChecklistModal; 