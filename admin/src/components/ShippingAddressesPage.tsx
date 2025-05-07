import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Table,
  Space,
  Typography,
  Tag,
  Tooltip,
  message,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { getShippingAddresses, createShippingAddress, updateShippingAddress, deleteShippingAddress, setDefaultShippingAddress } from '../services/api';

const { Title } = Typography;
const { TextArea } = Input;

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  userId: number;
}

const ShippingAddressesPage: React.FC = () => {
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
      await createShippingAddress({
        ...values,
        userId: parseInt(values.userId),
      });
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
      await updateShippingAddress(editingAddress.id, {
        ...values,
        userId: parseInt(values.userId),
      });
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => isDefault && (
        <Tag icon={<HomeOutlined />} color="success">
          Default
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ShippingAddress) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          {!record.isDefault && (
            <Tooltip title="Set as Default">
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>
          <Space>
            <HomeOutlined />
            Shipping Addresses Management
          </Space>
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add New Address
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={addresses}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
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
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: 'Please input the user ID!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
          >
            <Checkbox>Set as default address</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShippingAddressesPage; 