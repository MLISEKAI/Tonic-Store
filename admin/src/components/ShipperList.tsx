import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { shipperService } from '../services/api';

interface Shipper {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

const ShipperList: React.FC = () => {
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShippers = async () => {
    try {
      setLoading(true);
      const data = await shipperService.getAll();
      setShippers(data);
    } catch (error) {
      message.error('Failed to load shippers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippers();
  }, []);

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await shipperService.updateStatus(id, isActive);
      message.success('Shipper status updated successfully');
      fetchShippers();
    } catch (error) {
      message.error('Failed to update shipper status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await shipperService.delete(id);
      message.success('Shipper deleted successfully');
      fetchShippers();
    } catch (error) {
      message.error('Failed to delete shipper');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Shipper) => (
        <Space>
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusChange(record.id, checked)}
          />
          <Tag color={isActive ? 'success' : 'error'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Shipper) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa shipper này?"
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
      <Table
        columns={columns}
        dataSource={shippers}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default ShipperList; 