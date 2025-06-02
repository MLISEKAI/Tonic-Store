import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Rate, Tag, Modal, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { reviewService } from '../services/api';
import { Review } from '../types/review';

const { Text } = Typography;

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Review['status']) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
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
      render: (_: any, record: Review) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Lượt xem 
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
    <div>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
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
            <p><strong>Comment:</strong></p>
            <Text>{selectedReview.comment}</Text>
            <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <Tag color={getStatusColor(selectedReview.status)}>{selectedReview.status}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reviews; 