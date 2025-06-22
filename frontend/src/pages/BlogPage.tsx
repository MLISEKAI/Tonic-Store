import React, { useState } from 'react';
import { Typography, Row, Col, Card, Space, Tag, Button, Divider, Input, Menu, Dropdown } from 'antd';
import { CalendarOutlined, UserOutlined, EyeOutlined, TagOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
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
}

const categories = [
  {
    key: 'beauty',
    label: 'Khỏe Và Đẹp',
    children: [
      { key: 'beauty-food', label: 'Ăn Ngon' },
      { key: 'beauty-skincare', label: 'Làm Đẹp' },
      { key: 'beauty-health', label: 'Sức Khỏe' }
    ]
  },
  {
    key: 'lifestyle',
    label: 'Phong Cách Sống',
    children: [
      { key: 'lifestyle-entertainment', label: 'Giải Trí' },
      { key: 'lifestyle-home', label: 'Nhà Cửa' },
      { key: 'lifestyle-travel', label: 'Du Lịch' },
      { key: 'lifestyle-self-improvement', label: 'Phát Triển Bản Thân' }
    ]
  },
  {
    key: 'fashion',
    label: 'Thời Trang',
    children: [
      { key: 'fashion-kids', label: 'Thời Trang Cho Bé' },
      { key: 'fashion-men', label: 'Thời Trang Nam' },
      { key: 'fashion-women', label: 'Thời Trang Nữ' },
      { key: 'fashion-accessories', label: 'Phụ Kiện Thời Trang' }
    ]
  },
  {
    key: 'tech',
    label: 'Tin Công Nghệ',
    children: [
      { key: 'tech-smart-home', label: 'Điện Gia Dụng – Smarthome' },
      { key: 'tech-accessories', label: 'Phụ Kiện Công Nghệ' },
      { key: 'tech-mobile', label: 'Điện Thoại – Máy Tính Bảng' },
      { key: 'tech-computer', label: 'Máy Tính – Laptop' }
    ]
  },
  { key: 'news', label: 'Mới Cập Nhật' }
];

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Bộ trang điểm 3CE gồm những gì? Sẵn sàng đón hè cùng sản phẩm được săn đón nhất',
    summary: 'Khám phá bộ sưu tập trang điểm 3CE mới nhất, giúp bạn tự tin tỏa sáng trong mùa hè này.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/3ce-makeup.jpg',
    author: 'Le Quynh Nhu',
    publishDate: '2024-03-15',
    category: 'beauty',
    subcategory: 'beauty-makeup',
    tags: ['Trang điểm', '3CE', 'Mùa hè', 'Làm đẹp'],
    viewCount: 1500,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Review serum Bichup The Whoo: Tinh chất tự sinh chống lão hóa vượt trội',
    summary: 'Đánh giá chi tiết về serum Bichup The Whoo - sản phẩm chống lão hóa được ưa chuộng.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/the-whoo-review.jpg',
    author: 'Lê Văn C',
    publishDate: '2024-03-05',
    category: 'beauty',
    subcategory: 'beauty-skincare',
    tags: ['Skincare', 'The Whoo', 'Serum', 'Chống lão hóa'],
    viewCount: 800,
    isFeatured: false
  },
  {
    id: 3,
    title: 'Biến hình cực cháy cùng kem nhuộm tóc Garnier cho mùa hè',
    summary: 'Cập nhật xu hướng tóc mới nhất với kem nhuộm Garnier, giúp bạn nổi bật trong mùa hè.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/garnier-hair.jpg',
    author: 'Trần Thị B',
    publishDate: '2024-03-10',
    category: 'beauty',
    subcategory: 'bodycare',
    tags: ['Tóc', 'Garnier', 'Làm đẹp', 'Mùa hè'],
    viewCount: 1200,
    isFeatured: true
  },
  {
    id: 4,
    title: 'Review kem chống nắng nâng tone INNISFREE: Bảo vệ tối ưu, da mịn suốt 24h',
    summary: 'Khám phá kem chống nắng INNISFREE với khả năng bảo vệ da và nâng tone hoàn hảo.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/innisfree-sunscreen.jpg',
    author: 'Phạm Thị D',
    publishDate: '2024-03-01',
    category: 'beauty',
    subcategory: 'beauty-skincare',
    tags: ['Kem chống nắng', 'INNISFREE', 'Skincare', 'Làm đẹp'],
    viewCount: 1000,
    isFeatured: true
  },
  {
    id: 5,
    title: 'Tết đi đâu ở Sài Gòn – Top 10+ địa điểm du xuân 2025',
    summary: 'Khám phá những địa điểm du lịch hấp dẫn tại Sài Gòn trong dịp Tết 2025.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/saigon-travel.jpg',
    author: 'Nguyễn Văn A',
    publishDate: '2024-02-28',
    category: 'lifestyle',
    subcategory: 'travel',
    tags: ['Du lịch', 'Sài Gòn', 'Tết', 'Địa điểm'],
    viewCount: 2000,
    isFeatured: true
  },
  {
    id: 6,
    title: 'Xu hướng thời trang nữ 2024: Phong cách tối giản đang lên ngôi',
    summary: 'Cập nhật những xu hướng thời trang nữ mới nhất năm 2024 với phong cách tối giản.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/fashion-trends.jpg',
    author: 'Trần Thị C',
    publishDate: '2024-02-25',
    category: 'fashion',
    subcategory: 'fashion-women',
    tags: ['Thời trang', 'Xu hướng', 'Phong cách', 'Nữ'],
    viewCount: 1800,
    isFeatured: false
  },
  {
    id: 7,
    title: 'So sánh iPhone 15 Pro Max và Samsung Galaxy S24 Ultra: Đâu là lựa chọn tốt nhất?',
    summary: 'Phân tích chi tiết về hai siêu phẩm smartphone hàng đầu hiện nay.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/phone-comparison.jpg',
    author: 'Lê Văn D',
    publishDate: '2024-02-20',
    category: 'technology',
    subcategory: 'phones-tablets',
    tags: ['iPhone', 'Samsung', 'So sánh', 'Công nghệ'],
    viewCount: 2500,
    isFeatured: true
  },
  {
    id: 8,
    title: 'Top 5 món ăn giúp cải thiện làn da từ bên trong',
    summary: 'Những thực phẩm bổ dưỡng không chỉ ngon mà còn hỗ trợ chăm sóc sắc đẹp hiệu quả.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/food-beauty.jpg',
    author: 'Lê Mai H',
    publishDate: '2024-04-02',
    category: 'beauty',
    subcategory: 'healthy-eating',
    tags: ['Thực phẩm', 'Làm đẹp', 'Ăn ngon'],
    viewCount: 980,
    isFeatured: false
  },
  {
    id: 9,
    title: '6 mẹo đơn giản để nâng cao sức khỏe mỗi ngày',
    summary: 'Các thói quen đơn giản giúp bạn cải thiện sức khỏe thể chất và tinh thần.',
    content: 'Nội dung chi tiết về bài viết...',
    imageUrl: 'https://example.com/health-tips.jpg',
    author: 'Phạm Văn B',
    publishDate: '2024-04-10',
    category: 'beauty',
    subcategory: 'health',
    tags: ['Sức khỏe', 'Thói quen', 'Cuộc sống'],
    viewCount: 1200,
    isFeatured: false
  },
  {
    id: 10,
    title: 'Top phim Hàn không thể bỏ lỡ mùa hè này',
    summary: 'Danh sách những bộ phim truyền hình Hàn Quốc được yêu thích nhất năm 2024.',
    content: 'Nội dung chi tiết...',
    imageUrl: 'https://example.com/kdrama-summer.jpg',
    author: 'Nguyễn Thị K',
    publishDate: '2024-03-25',
    category: 'lifestyle',
    subcategory: 'entertainment',
    tags: ['Phim', 'Giải trí', 'Hàn Quốc'],
    viewCount: 1340,
    isFeatured: true
  },
  {
    id: 11,
    title: '5 cách chọn giày phù hợp với trang phục công sở',
    summary: 'Kết hợp giày và đồ công sở đúng cách giúp bạn thêm phần chuyên nghiệp và thời trang.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/office-shoes.jpg',
    author: 'Hoàng Thảo',
    publishDate: '2024-04-12',
    category: 'fashion',
    subcategory: 'fashion-tips',
    tags: ['Giày', 'Công sở', 'Thời trang'],
    viewCount: 1110,
    isFeatured: false
  },
  {
    id: 12,
    title: 'Apple Vision Pro chính thức ra mắt: Tương lai của kính thực tế ảo',
    summary: 'Apple Vision Pro đã gây sốt với công nghệ mới và thiết kế vượt trội.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/vision-pro.jpg',
    author: 'Đặng Minh',
    publishDate: '2024-04-20',
    category: 'technology',
    subcategory: 'ai-vr',
    tags: ['Apple', 'Vision Pro', 'Thực tế ảo'],
    viewCount: 2001,
    isFeatured: true
  },
  {
    id: 13,
    title: 'Dưỡng trắng da với mặt nạ thiên nhiên tại nhà',
    summary: 'Tự tay làm mặt nạ dưỡng trắng từ nguyên liệu dễ tìm và an toàn.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/natural-mask.jpg',
    author: 'Hà My',
    publishDate: '2024-04-03',
    category: 'beauty',
    subcategory: 'beauty-skincare',
    tags: ['Mặt nạ', 'Thiên nhiên', 'Dưỡng da'],
    viewCount: 890,
    isFeatured: false
  },
  {
    id: 14,
    title: 'Bí quyết phối đồ phong cách Hàn Quốc cá tính',
    summary: 'Hướng dẫn mix & match để tạo phong cách Hàn Quốc trẻ trung.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/kfashion-style.jpg',
    author: 'Ngọc Mai',
    publishDate: '2024-03-18',
    category: 'fashion',
    subcategory: 'fashion-women',
    tags: ['Hàn Quốc', 'Phong cách', 'Phối đồ'],
    viewCount: 1450,
    isFeatured: false
  },
  {
    id: 15,
    title: 'Thực đơn giảm cân hiệu quả trong 7 ngày',
    summary: 'Thực đơn khoa học giúp bạn giảm cân an toàn và duy trì sức khỏe.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/meal-plan.jpg',
    author: 'Vũ Hùng',
    publishDate: '2024-04-08',
    category: 'beauty',
    subcategory: 'healthy-eating',
    tags: ['Giảm cân', 'Ăn kiêng', 'Thực đơn'],
    viewCount: 1700,
    isFeatured: true
  },
  {
    id: 16,
    title: '5 ứng dụng AI giúp nâng cao hiệu suất làm việc',
    summary: 'Khám phá các công cụ AI hỗ trợ bạn tối ưu công việc hằng ngày.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/ai-tools.jpg',
    author: 'Lê Thanh',
    publishDate: '2024-04-06',
    category: 'technology',
    subcategory: 'ai-vr',
    tags: ['AI', 'Hiệu suất', 'Công nghệ'],
    viewCount: 1970,
    isFeatured: false
  },
  {
    id: 17,
    title: 'Chọn nước hoa phù hợp với mùa hè',
    summary: 'Gợi ý các loại nước hoa mang lại cảm giác tươi mát, nhẹ nhàng.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/summer-perfume.jpg',
    author: 'Trịnh Hoa',
    publishDate: '2024-04-05',
    category: 'beauty',
    subcategory: 'bodycare',
    tags: ['Nước hoa', 'Hương thơm', 'Mùa hè'],
    viewCount: 950,
    isFeatured: false
  },
  {
    id: 18,
    title: 'Điểm danh 5 thương hiệu thời trang Việt nổi bật năm 2024',
    summary: 'Giới thiệu các thương hiệu Việt được yêu thích vì thiết kế sáng tạo và chất lượng.',
    content: 'Chi tiết bài viết...',
    imageUrl: 'https://example.com/vietnam-fashion.jpg',
    author: 'Hồ Phương',
    publishDate: '2024-04-09',
    category: 'fashion',
    subcategory: 'fashion-local',
    tags: ['Thời trang Việt', 'Thương hiệu', '2024'],
    viewCount: 1260,
    isFeatured: true
  }
];


const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const filteredPosts = blogPosts.filter(post => {
    if (selectedSubcategory !== 'all') {
      return post.subcategory === selectedSubcategory;
    } else if (selectedCategory !== 'all') {
      return post.category === selectedCategory;
    }
    return true;
  });

  const getCategoryLabel = (key: string) => {
    const category = categories.find(cat => cat.key === key);
    return category?.label || '';
  };

  const getSubcategoryLabel = (categoryKey: string, subcategoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey);
    const subcategory = category?.children?.find(sub => sub.key === subcategoryKey);
    return subcategory?.label || '';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1}>Trang Blog Chính Thức</Title>
        <Paragraph style={{ fontSize: '18px' }}>
          Khám phá xu hướng mới nhất và săn các ưu đãi cực hot cùng Blog
        </Paragraph>
      </div>

      {/* Search and Navigation */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col span={24}>
          <Search
            placeholder="Tìm kiếm bài viết..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
          />
        </Col>
        <Col span={24}>
          <Menu mode="horizontal" style={{ borderBottom: 'none' }}>
          {categories.map((category) =>
              category.children ? (
                <Menu.SubMenu
                  key={category.key}
                  title={
                    <span onClick={() => handleCategoryClick(category.key)}>
                      {category.label}
                      <DownOutlined />
                    </span>
                  }
                >
                  {category.children.map((subcategory) => (
                    <Menu.Item
                      key={subcategory.key}
                      onClick={() => handleSubcategoryClick(subcategory.key)}
                    >
                      {subcategory.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                >
                  {category.label}
                </Menu.Item>
              )
            )}
          </Menu>
        </Col>
      </Row>

      {/* Category Section */}
      {selectedCategory !== 'all' && (
        <div style={{ marginBottom: '40px' }}>
          <Title level={2}>
            {getCategoryLabel(selectedCategory)}
            {selectedSubcategory !== 'all' && ` - ${getSubcategoryLabel(selectedCategory, selectedSubcategory)}`}
          </Title>

          {filteredPosts.length === 0 ? (
            <Paragraph style={{ fontSize: '16px', color: 'gray' }}>
              Hiện chưa có bài viết nào cho danh mục này. Vui lòng quay lại sau!
            </Paragraph>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredPosts.map((post) => (
                <Col xs={24} md={8} key={post.id}>
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
                        <Link to={`/blog/${post.id}`}>
                          <Title level={4} style={{ margin: 0 }}>
                            {post.title}
                          </Title>
                        </Link>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                          <Space wrap>
                            <Tag icon={<CalendarOutlined />}>{post.publishDate}</Tag>
                            <Tag icon={<UserOutlined />}>{post.author}</Tag>
                            <Tag icon={<EyeOutlined />}>{post.viewCount} lượt xem</Tag>
                          </Space>
                          <Button type="link" block>
                            <Link to={`/blog/${post.id}`}>Đọc thêm</Link>
                          </Button>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      {/* Featured Posts */}
      <div style={{ marginBottom: '40px' }}>
        <Title level={2}>Bài Viết Nổi Bật</Title>
        <Row gutter={[24, 24]}>
          {blogPosts.filter(post => post.isFeatured).map((post) => (
            <Col xs={24} md={10} key={post.id}>
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
                      <Tag color="gold">Bài viết nổi bật</Tag>
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

      {/* Latest Posts */}
      <div>
        <Title level={2}>Bài Viết Mới Nhất</Title>
        <Row gutter={[24, 24]}>
          {blogPosts.map((post) => (
            <Col xs={24} md={8} key={post.id}>
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
                    <Link to={`/blog/${post.id}`}>
                      <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
                    </Link>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                      <Space wrap>
                        <Tag icon={<CalendarOutlined />}>{post.publishDate}</Tag>
                        <Tag icon={<UserOutlined />}>{post.author}</Tag>
                      </Space>
                      <Button type="link" block>
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
    </div>
  );
};

export default BlogPage; 