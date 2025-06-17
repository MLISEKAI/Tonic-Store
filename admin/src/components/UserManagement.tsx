import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, Checkbox, Space, Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { userService } from '../services/userService';
import { User, CreateUserData, UpdateUserData } from '../types/user';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
      });
      setChangePassword(false);
    } else {
      setSelectedUser(null);
      form.resetFields();
      setChangePassword(true);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedUser) {
        // Update user info
        const updateData: UpdateUserData = {
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone,
          address: values.address,
        };
        
        await userService.updateUser(selectedUser.id, updateData);
        
        // If password change is requested
        if (changePassword && values.password) {
          await userService.changeUserPassword(selectedUser.id, values.password);
        }
      } else {
        await userService.createUser(values);
      }
      fetchUsers();
      handleCancel();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => address || '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: User) => (
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
          Quản lý người dùng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />

      <Modal
        title={selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true },
              { type: 'email' }
            ]}
          >
            <Input />
          </Form.Item>

          {selectedUser && (
            <Form.Item>
              <Checkbox
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
              >
                Đổi mật khẩu
              </Checkbox>
            </Form.Item>
          )}

          {(changePassword || !selectedUser) && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: !selectedUser }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
              <Select.Option value="DELIVERY">Shipper</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement; 