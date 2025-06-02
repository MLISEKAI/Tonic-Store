import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, DatePicker, InputNumber, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { promotionService } from '../services/api';

const { RangePicker } = DatePicker;

interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getAll();
      setPromotions(data);
    } catch (error) {
      message.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAdd = () => {
    setEditingPromotion(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Promotion) => {
    setEditingPromotion(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await promotionService.delete(id);
      message.success('Promotion deleted successfully');
      fetchPromotions();
    } catch (error) {
      message.error('Failed to delete promotion');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const [startDate, endDate] = values.dateRange;
      const promotionData = {
        ...values,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      delete promotionData.dateRange;

      if (editingPromotion) {
        await promotionService.update(editingPromotion.id, promotionData);
        message.success('Promotion updated successfully');
      } else {
        await promotionService.create(promotionData);
        message.success('Promotion created successfully');
      }
      setModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error(`Failed to ${editingPromotion ? 'update' : 'create'} promotion`);
    }
  };

  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại giảm giá',
      key: 'discount',
      render: (record: Promotion) => (
        `${record.discountType === 'PERCENTAGE' ? record.discountValue + '%' : '$' + record.discountValue}`
      ),
    },
    {
      title: 'Thời hạn',
      key: 'validity',
      render: (record: Promotion) => (
        `${new Date(record.startDate).toLocaleDateString()} - ${new Date(record.endDate).toLocaleDateString()}`
      ),
    },
    {
      title: 'Số lần sử dụng',
      key: 'usage',
      render: (record: Promotion) => (
        `${record.usedCount}/${record.usageLimit}`
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Promotion) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm mã giảm giá
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingPromotion ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="Mã giảm giá"
            rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="discountType"
            label="Loại giảm giá"
            rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá' }]}
          >
            <Select>
              <Select.Option value="PERCENTAGE">Phần trăm</Select.Option>
              <Select.Option value="FIXED_AMOUNT">Số tiền</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discountValue"
            label="Giá trị giảm"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="maxDiscount"
            label="Giá trị giảm tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm tối đa' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời hạn"
            rules={[{ required: true, message: 'Vui lòng chọn thời hạn' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="usageLimit"
            label="Số lần sử dụng"
            rules={[{ required: true, message: 'Vui lòng nhập số lần sử dụng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? 'Cập nhật' : 'Tạo mã giảm giá'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy bỏ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Promotions; 