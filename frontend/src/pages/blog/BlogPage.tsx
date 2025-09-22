import React, { useMemo, useState } from 'react';
import { Typography, Row, Col, Card, Space, Tag, Button, Input, Select } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, SearchOutlined, LikeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Search } = Input;

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  category: string;
  subcategory: string;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
  likes?: number;
}

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Xu Hướng Thời Trang 2024: Những Màu Sắc Hot Nhất',
      summary: 'Khám phá những xu hướng màu sắc thời trang đang thống trị năm 2024 và cách phối đồ để luôn nổi bật.',
      content: 'Nội dung chi tiết...',
      author: 'Tonic Fashion Team',
      publishDate: '2024-01-15',
      category: 'Fashion',
      subcategory: 'Trends',
      imageUrl: 'https://img.freepik.com/premium-photo/fashion-trends-2024_136595-1234.jpg',
      viewCount: 1250,
      likes: 89,
      tags: ['thời trang', 'xu hướng', 'màu sắc', '2024'],
      isFeatured: true,
    },
    {
      id: 2,
      title: 'Hướng Dẫn Chọn Size Quần Áo Online',
      summary: 'Bí quyết chọn size quần áo phù hợp khi mua online để tránh tình trạng phải đổi hàng.',
      content: 'Nội dung chi tiết...',
      author: 'Tonic Style Guide',
      publishDate: '2024-01-12',
      category: 'Shopping',
      subcategory: 'Guide',
      imageUrl: 'https://img.freepik.com/premium-photo/online-shopping-size-guide_136595-5678.jpg',
      viewCount: 2100,
      likes: 156,
      tags: ['mua sắm', 'size', 'hướng dẫn', 'online'],
      isFeatured: false,
    },
    {
      id: 3,
      title: 'Cách Bảo Quản Quần Áo Đúng Cách',
      summary: 'Những mẹo hay để giữ quần áo luôn mới và bền đẹp theo thời gian.',
      content: 'Nội dung chi tiết...',
      author: 'Tonic Care Team',
      publishDate: '2024-01-10',
      category: 'Care',
      subcategory: 'Tips',
      imageUrl: 'https://img.freepik.com/premium-photo/clothing-care-tips_136595-9012.jpg',
      viewCount: 980,
      likes: 67,
      tags: ['bảo quản', 'quần áo', 'mẹo hay', 'chăm sóc'],
      isFeatured: false,
    },
    {
      id: 4,
      title: 'Top 10 Sản Phẩm Bán Chạy Nhất Tháng',
      summary: 'Danh sách những sản phẩm được khách hàng yêu thích nhất trong tháng vừa qua.',
      content: 'Nội dung chi tiết...',
      author: 'Tonic Analytics',
      publishDate: '2024-01-08',
      category: 'Trending',
      subcategory: 'Sales',
      imageUrl: 'https://img.freepik.com/premium-photo/best-selling-products_136595-3456.jpg',
      viewCount: 3200,
      likes: 234,
      tags: ['bán chạy', 'top', 'sản phẩm', 'tháng'],
      isFeatured: true,
    },
    {
      id: 5,
      title: 'Lịch Sử Và Sự Phát Triển Của Tonic Store',
      summary: 'Hành trình từ một cửa hàng nhỏ đến thương hiệu thời trang hàng đầu Việt Nam.',
      content: 'Nội dung chi tiết...',
      author: 'Tonic History',
      publishDate: '2024-01-05',
      category: 'Company',
      subcategory: 'History',
      imageUrl: 'https://img.freepik.com/premium-photo/company-history-growth_136595-7890.jpg',
      viewCount: 1500,
      likes: 98,
      tags: ['lịch sử', 'phát triển', 'công ty', 'thương hiệu'],
      isFeatured: false,
    },
  ];

  const categories = [
    { key: 'all', label: 'Tất Cả' },
    { key: 'Fashion', label: 'Thời Trang', children: [{ key: 'Fashion/Trends', label: 'Xu Hướng' }] },
    { key: 'Shopping', label: 'Mua Sắm', children: [{ key: 'Shopping/Guide', label: 'Hướng Dẫn' }] },
    { key: 'Care', label: 'Chăm Sóc', children: [{ key: 'Care/Tips', label: 'Mẹo Hay' }] },
    { key: 'Trending', label: 'Xu Hướng', children: [{ key: 'Trending/Sales', label: 'Bán Chạy' }] },
    { key: 'Company', label: 'Công Ty', children: [{ key: 'Company/History', label: 'Lịch Sử' }] },
  ];

  const filteredPosts = useMemo(() => {
    const byCategory = blogPosts.filter(post => {
      if (selectedSubcategory !== 'all') {
        return post.subcategory === selectedSubcategory;
      } else if (selectedCategory !== 'all') {
        return post.category === selectedCategory;
      }
      return true;
    });

    if (!searchTerm.trim()) return byCategory;
    const term = searchTerm.toLowerCase();
    return byCategory.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.summary.toLowerCase().includes(term) ||
      post.tags.some(t => t.toLowerCase().includes(term))
    );
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Blog Tonic
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Cập nhật những xu hướng thời trang mới nhất và mẹo hay cho phong cách của bạn
          </Paragraph>
        </div>

        {/* Search and Navigation */}
        <div className="mb-10">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12} md={7}>
              <Select
                size="large"
                className="w-full"
                value={selectedCategory}
                onChange={handleCategoryClick}
                options={[
                  { value: 'all', label: 'Tất cả danh mục' },
                  ...categories.map(c => ({ value: c.key, label: c.label }))
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={7}>
              <Select
                size="large"
                className="w-full"
                value={selectedSubcategory}
                onChange={handleSubcategoryClick}
                options={[
                  { value: 'all', label: 'Tất cả chủ đề' },
                  ...((categories.find(c => c.key === selectedCategory)?.children) || []).map(sc => ({ value: sc.key, label: sc.label }))
                ]}
                disabled={selectedCategory === 'all'}
              />
            </Col>
          </Row>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <Title level={2} className="mb-6">Bài Viết Nổi Bật</Title>
            <Card
              className="mb-6"
              cover={
                <img
                  alt={filteredPosts[0].title}
                  src={filteredPosts[0].imageUrl}
                  className="h-64 object-cover"
                />
              }
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Tag color="blue">{filteredPosts[0].category}</Tag>
                  <Space>
                    <CalendarOutlined />
                    <div>{formatDate(filteredPosts[0].publishDate)}</div>
                  </Space>
                </div>
                <Title level={3} className="mb-4">
                  {filteredPosts[0].title}
                </Title>
                <Paragraph className="text-gray-600 mb-4">
                  {filteredPosts[0].summary}
                </Paragraph>
                <div className="flex items-center justify-between">
                  <Space>
                    <UserOutlined />
                    <div>{filteredPosts[0].author}</div>
                  </Space>
                  <Space>
                    <Space>
                      <EyeOutlined />
                      <div>{filteredPosts[0].viewCount}</div>
                    </Space>
                    <Space>
                      <LikeOutlined />
                      <div>{filteredPosts[0].likes}</div>
                    </Space>
                  </Space>
                </div>
                <div className="mt-4">
                  <Link to={`/blog/${filteredPosts[0].id}`}>
                    <Button type="primary" size="large">
                      Đọc Thêm
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div>
          <Title level={2} className="mb-6">Tất Cả Bài Viết</Title>
          <Row gutter={[24, 24]}>
            {filteredPosts.slice(1).map(post => (
              <Col xs={24} sm={12} lg={8} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={post.title}
                      src={post.imageUrl}
                      className="h-48 object-cover"
                    />
                  }
                  className="h-full"
                >
                  <div className="p-4">
                    <div className="mb-3">
                      <Tag className="mb-2" color="blue">{post.category}</Tag>
                      <Space wrap>
                         <Tag icon={<CalendarOutlined />}>{post.publishDate}</Tag>
                         <Tag icon={<UserOutlined />}>{post.author}</Tag>
                        <Tag icon={<EyeOutlined />}>{post.viewCount} lượt xem</Tag>
                        {typeof post.likes === 'number' && (
                          <Tag icon={<LikeOutlined />}>{post.likes} lượt thích</Tag>
                        )}
                       </Space>
                    </div>
                    <Title level={4} className="mb-3 line-clamp-2">
                      {post.title}
                    </Title>
                    <Paragraph className="text-gray-600 mb-4 line-clamp-3">
                      {post.summary}
                    </Paragraph>
                    <div className="flex items-center justify-between mb-4">
                      <Space>
                        <UserOutlined />
                        <div className="text-sm">{post.author}</div>
                      </Space>
                      <Space>
                        <Space>
                          <EyeOutlined />
                          <div className="text-sm">{post.viewCount}</div>
                        </Space>
                        <Space>
                          <LikeOutlined />
                          <div className="text-sm">{post.likes}</div>
                        </Space>
                      </Space>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <Button type="primary" block>
                        Đọc Thêm
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="large" type="default">
            Xem Thêm Bài Viết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
