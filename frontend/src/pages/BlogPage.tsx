import React from 'react';
import { Typography, Row, Col, Card, Space, Tag, Button, Divider } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, TagOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
}

// Temporary mock data - will be replaced with API call
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max: Trải nghiệm thực tế từ người dùng',
    summary: 'Chia sẻ những trải nghiệm thực tế khi sử dụng iPhone 15 Pro Max, từ camera đến hiệu năng và thời lượng pin.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/iphone-15-review.jpg',
    author: 'Nguyễn Văn A',
    publishDate: '2024-03-15',
    category: 'Đánh giá sản phẩm',
    tags: ['iPhone', 'Apple', 'Camera', 'Trải nghiệm'],
    viewCount: 1500,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Công nghệ AI và IoT: Tương lai của ngành công nghệ',
    summary: 'Phân tích sâu về tác động của AI và IoT đến cuộc sống hiện đại và xu hướng phát triển trong tương lai.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/tech-trends-2024.jpg',
    author: 'Trần Thị B',
    publishDate: '2024-03-10',
    category: 'Công nghệ',
    tags: ['AI', 'IoT', 'Công nghệ', 'Xu hướng'],
    viewCount: 1200,
    isFeatured: true
  },
  {
    id: 3,
    title: 'Hướng dẫn chọn laptop phù hợp cho công việc và học tập',
    summary: 'Tư vấn chi tiết về cách chọn laptop phù hợp với nhu cầu công việc và học tập, kèm theo các gợi ý cụ thể.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/student-laptop-guide.jpg',
    author: 'Lê Văn C',
    publishDate: '2024-03-05',
    category: 'Hướng dẫn',
    tags: ['Laptop', 'Mua sắm', 'Hướng dẫn', 'Công nghệ'],
    viewCount: 800,
    isFeatured: false
  },
  {
    id: 4,
    title: 'Samsung Galaxy S24 Ultra: Trải nghiệm người dùng thực tế',
    summary: 'Chia sẻ chi tiết về trải nghiệm sử dụng Samsung Galaxy S24 Ultra trong cuộc sống hàng ngày.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/samsung-s24-review.jpg',
    author: 'Phạm Thị D',
    publishDate: '2024-03-01',
    category: 'Đánh giá sản phẩm',
    tags: ['Samsung', 'Galaxy S24', 'Trải nghiệm', 'Smartphone'],
    viewCount: 1000,
    isFeatured: true
  }
];

const BlogPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Blog</Title>
      <Paragraph>
        Khám phá những bài viết chia sẻ về công nghệ, đánh giá sản phẩm và trải nghiệm người dùng từ đội ngũ chuyên gia của Tonic Store.
      </Paragraph>

      <Row gutter={[24, 24]}>
        {blogPosts.map((post) => (
          <Col xs={24} md={12} key={post.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.imageUrl}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Link to={`/blog/${post.id}`}>
                      <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
                    </Link>
                    {post.isFeatured && (
                      <Tag color="gold">Bài viết nổi bật</Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                    <Space wrap>
                      <Tag icon={<CalendarOutlined />}>{post.publishDate}</Tag>
                      <Tag icon={<UserOutlined />}>{post.author}</Tag>
                      <Tag icon={<EyeOutlined />}>{post.viewCount} lượt xem</Tag>
                      <Tag icon={<TagOutlined />}>{post.category}</Tag>
                    </Space>
                    <Space wrap>
                      {post.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                    <Divider style={{ margin: '12px 0' }} />
                    <Button type="primary" block>
                      <Link to={`/blog/${post.id}`}>Đọc thêm</Link>
                    </Button>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogPage; 