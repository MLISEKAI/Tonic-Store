import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, Checkbox, Space, Card, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { userService } from '../services/userService';
import { User, UpdateUserData } from '../types/user';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        message.success('Cập nhật người dùng thành công!');
      } else {
        await userService.createUser(values);
        message.success('Thêm người dùng thành công!');
        // Chờ 1 chút nếu cần (token/session đồng bộ)
        await new Promise(r => setTimeout(r, 200));

        // Fetch lại danh sách user
        await fetchUsers();
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const showDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmed(false);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
    setDeleteConfirmed(false);
  };

  const handleDelete = async () => {
    if (!userToDelete || !deleteConfirmed) {
      message.warning('Vui lòng xác nhận bằng cách tích vào ô xác nhận!');
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteUser(userToDelete.id, true); // Force delete
      message.success('Xóa người dùng thành công! Dữ liệu mua hàng đã được giữ lại trong dashboard.');
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
      setDeleteConfirmed(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại!';
      message.error(errorMessage);
    } finally {
      setIsDeleting(false);
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
            onClick={() => showDeleteModal(record)}
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
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
              { whitespace: true, message: 'Họ tên không được chỉ chứa khoảng trắng!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { whitespace: true, message: 'Email không được chứa khoảng trắng!' }
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
              rules={[
                { required: changePassword || !selectedUser, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                { whitespace: true, message: 'Mật khẩu không được chứa khoảng trắng!' }
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
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
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' },
              { whitespace: true, message: 'Số điện thoại không được chứa khoảng trắng!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' },
              { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' },
              { whitespace: true, message: 'Địa chỉ không được chỉ chứa khoảng trắng!' }
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa người dùng"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeleting }}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>
            <strong>Bạn có chắc chắn muốn xóa người dùng này?</strong>
          </p>
          {userToDelete && (
            <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 12 }}>
              <p style={{ margin: 0 }}><strong>Tên:</strong> {userToDelete.name}</p>
              <p style={{ margin: 0 }}><strong>Email:</strong> {userToDelete.email}</p>
              <p style={{ margin: 0 }}><strong>Vai trò:</strong> {userToDelete.role}</p>
            </div>
          )}
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffc107', 
            borderRadius: 4, 
            padding: 12, 
            marginBottom: 16 
          }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <strong>⚠️ Lưu ý quan trọng:</strong>
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#856404' }}>
              <li>Người dùng này sẽ bị xóa kể cả khi đang còn liên kết với các bảng hay dữ liệu khác</li>
              <li>Dữ liệu mua hàng (orders) sẽ được giữ lại trong dashboard để thống kê</li>
              <li>Một số dữ liệu không quan trọng sẽ bị xóa (giỏ hàng, danh sách yêu thích, thông báo, etc.)</li>
              <li>Thông tin người dùng sẽ được ẩn danh nhưng hồ sơ vẫn tồn tại để liên kết với đơn hàng</li>
            </ul>
          </div>
          <Checkbox
            checked={deleteConfirmed}
            onChange={(e) => setDeleteConfirmed(e.target.checked)}
            style={{ marginTop: 8 }}
          >
            <span style={{ fontWeight: 'bold' }}>Tôi hiểu và xác nhận muốn xóa người dùng này</span>
          </Checkbox>
        </div>
      </Modal>
    </Card>
  );
};

export default UserManagement; 