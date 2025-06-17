import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Rate, Tag, Modal, Typography, Card } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { reviewService } from '../services/api';
import { Review } from '../types/review';

const { Text } = Typography;

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

const { Title } = Typography;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAll();
      console.log('Fetched reviews:', data);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Không thể tải danh sách đánh giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await reviewService.delete(id);
      message.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      message.error('Failed to delete review');
    }
  };

  const handleStatusChange = async (id: string, status: Review['status']) => {
    try {
      await reviewService.updateStatus(id, status);
      message.success('Review status updated successfully');
      fetchReviews();
    } catch (error) {
      message.error('Failed to update review status');
    }
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'productName',
    },
    {
      title: 'Người dùng',
      dataIndex: ['user', 'name'],
      key: 'userName',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
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
      render: (_: any, record: Review) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleView(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusChange(record.id, 'APPROVED')}
              >
                Duyệt
              </Button>
              <Button
                danger
                onClick={() => handleStatusChange(record.id, 'REJECTED')}
              >
                Từ chối
              </Button>
            </>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bình luận này không?"
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
        Danh sách bình luận và đánh giá
      </Title>
    </div>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bình luận và đánh giá`,
        }}
      />

      <Modal
        title="Review Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedReview && (
          <div>
            <p><strong>Product:</strong> {selectedReview.product.name}</p>
            <p><strong>User:</strong> {selectedReview.user.name}</p>
            <p><strong>Rating:</strong> <Rate disabled defaultValue={selectedReview.rating} /></p>
            <p><strong>Comment:</strong><Text>{selectedReview.comment}</Text></p>
            <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default Reviews; 