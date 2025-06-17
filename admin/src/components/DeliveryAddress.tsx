import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Input, Table, Space, Typography, Tag, Tooltip, message, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined, HomeOutlined } from '@ant-design/icons';
import { getShippingAddresses, createShippingAddress, updateShippingAddress, deleteShippingAddress, setDefaultShippingAddress } from '../services/api';
import { ShippingAddress, CreateShippingAddressData, UpdateShippingAddressData } from '../types/shipping';

const { Title } = Typography;
const { TextArea } = Input;

const DeliveryAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [form] = Form.useForm();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getShippingAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch shipping addresses:', error);
      message.error('Failed to fetch shipping addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const data: CreateShippingAddressData = {
        ...values,
        userId: parseInt(values.userId),
      };
      await createShippingAddress(data);
      setIsModalVisible(false);
      form.resetFields();
      fetchAddresses();
      message.success('Address created successfully');
    } catch (error) {
      console.error('Failed to create address:', error);
      message.error('Failed to create address');
    }
  };

  const handleUpdate = async () => {
    if (!editingAddress) return;
    try {
      const values = await form.validateFields();
      const data: UpdateShippingAddressData = {
        ...values,
        userId: parseInt(values.userId),
      };
      await updateShippingAddress(editingAddress.id, data);
      setIsModalVisible(false);
      form.resetFields();
      fetchAddresses();
      message.success('Address updated successfully');
    } catch (error) {
      console.error('Failed to update address:', error);
      message.error('Failed to update address');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteShippingAddress(id);
      fetchAddresses();
      message.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      message.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultShippingAddress(id);
      fetchAddresses();
      message.success('Default address updated successfully');
    } catch (error) {
      console.error('Failed to set default address:', error);
      message.error('Failed to set default address');
    }
  };

  const showModal = (address?: ShippingAddress) => {
    if (address) {
      setEditingAddress(address);
      form.setFieldsValue({
        name: address.name,
        phone: address.phone,
        address: address.address,
        userId: address.userId.toString(),
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingAddress(null);
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'name'],
      key: 'customer',
      render: (text: string, record: ShippingAddress) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-500">{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => isDefault && (
        <Tag icon={<HomeOutlined />} color="success">
          Mặc định
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: ShippingAddress) => (
        <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            >
              Sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              Xóa
            </Button>

          {!record.isDefault && (
            <Tooltip title="Đặt làm mặc định">
              <Button
                type="default"
                icon={<StarOutlined />}
                onClick={() => handleSetDefault(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Quản lý địa chỉ giao hàng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={addresses}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} địa chỉ giao hàng`,
        }}
      />

      <Modal
        title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={editingAddress ? handleUpdate : handleCreate}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="userId"
            label="ID người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập ID người dùng!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
          >
            <Checkbox>Đặt là địa chỉ mặc định</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DeliveryAddress; 