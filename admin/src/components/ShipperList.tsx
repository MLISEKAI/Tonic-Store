import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Card, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { shipperService } from '../services/api';
import { Shipper } from '../types/user';

const { Title } = Typography;

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

  const handleDelete = async (id: number) => {
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
          Danh sách người giao hàng
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={shippers}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người giao hàng `,
        }}
      />
    </Card>
  );
}

export default ShipperList; 