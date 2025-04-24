import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getShippingAddresses, 
  createShippingAddress, 
  updateShippingAddress, 
  deleteShippingAddress,
  setDefaultShippingAddress
} from '../services/api';
import { Button, Form, Input, Modal, Table, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';

interface ShippingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const ShippingAddressManager: React.FC = () => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [form] = Form.useForm();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getShippingAddresses(token);
      setAddresses(data);
    } catch (error) {
      message.error('Failed to fetch shipping addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editingAddress) {
        await updateShippingAddress(token, editingAddress.id, values);
        message.success('Address updated successfully');
      } else {
        await createShippingAddress(token, values);
        message.success('Address created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchAddresses();
    } catch (error) {
      message.error('Failed to save address');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteShippingAddress(token, id);
      message.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      message.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultShippingAddress(token, id);
      message.success('Default address updated successfully');
      fetchAddresses();
    } catch (error) {
      message.error('Failed to set default address');
    }
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
      title: 'Default',
      key: 'isDefault',
      render: (record: ShippingAddress) => (
        record.isDefault ? <StarOutlined style={{ color: '#1890ff' }} /> : null
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ShippingAddress) => (
        <div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingAddress(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<StarOutlined />}
            onClick={() => handleSetDefault(record.id)}
            disabled={record.isDefault}
          />
          <Popconfirm
            title="Are you sure you want to delete this address?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingAddress(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
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
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input phone!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
          >
            <Input type="checkbox" /> Set as default address
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAddress ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShippingAddressManager; 