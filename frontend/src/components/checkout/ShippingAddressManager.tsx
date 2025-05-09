import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShippingAddress } from '../../hooks';
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
  const token = localStorage.getItem('token');
  const { 
    addresses, 
    loading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useShippingAddress(token);
  
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<ShippingAddress | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, values);
    } else {
      await addAddress(values);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    await deleteAddress(id);
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
  };

  return (
    <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => {
          setEditingAddress(null);
          setIsModalVisible(true);
        }}
      >
        Thêm địa chỉ mới
      </Button>

      <Table
        dataSource={addresses}
        loading={loading}
        columns={[
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
            key: 'isDefault',
            render: (_, record) => (
              record.isDefault ? 
                <StarOutlined style={{ color: '#1890ff' }} /> : 
                <Button 
                  type="link" 
                  onClick={() => handleSetDefault(record.id)}
                >
                  Đặt làm mặc định
                </Button>
            ),
          },
          {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
              <>
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingAddress(record);
                    form.setFieldsValue(record);
                    setIsModalVisible(true);
                  }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc muốn xóa địa chỉ này?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAddress ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShippingAddressManager; 