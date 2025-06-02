import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const { Title } = Typography;

const Login: React.FC = () => {
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [form] = Form.useForm();

const handleSubmit = async (values: { email: string; password: string }) => {
    try {
        setLoading(true);
        const data = await login(values.email, values.password);
        
        // Check if user is admin
        if (data.user.role !== 'ADMIN') {
            throw new Error('Bạn không có quyền truy cập trang admin');
        }
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
    } catch (error) {
        notification.error({
            message: 'Lỗi',
            description: error instanceof Error ? error.message : 'Invalid email or password',
            placement: 'topRight',
            duration: 2,
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400, padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2}>Đăng nhập Admin</Title>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
