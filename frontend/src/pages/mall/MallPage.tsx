import React, { useState } from 'react';
import { Card, Row, Col, Button, Input, Typography, Tag, Space, Select, Slider } from 'antd';
import { SearchOutlined, StarOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface MallProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
  brand: string;
  isNew?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
}

const MallPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { key: 'all', label: 'Tất Cả' },
    { key: 'fashion', label: 'Thời Trang' },
    { key: 'electronics', label: 'Điện Tử' },
    { key: 'home', label: 'Nhà Cửa' },
    { key: 'beauty', label: 'Làm Đẹp' },
    { key: 'sports', label: 'Thể Thao' },
  ];

  const brands = [
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Samsung', 'Apple', 'Sony'
  ];

  const products: MallProduct[] = [
    {
      id: 1,
      name: 'Áo Thun Nam Cotton Cao Cấp',
      price: 299000,
      originalPrice: 399000,
      discount: 25,
      rating: 4.8,
      reviewCount: 1250,
      imageUrl: 'https://img.freepik.com/premium-photo/men-t-shirt_136595-1234.jpg',
      category: 'fashion',
      brand: 'Tonic',
      isNew: true,
      isHot: true,
    },
    {
      id: 2,
      name: 'Quần Jeans Nữ Skinny',
      price: 599000,
      rating: 4.6,
      reviewCount: 890,
      imageUrl: 'https://img.freepik.com/premium-photo/women-jeans_136595-5678.jpg',
      category: 'fashion',
      brand: 'Tonic',
      isFeatured: true,
    },
    {
      id: 3,
      name: 'Điện Thoại Samsung Galaxy S24',
      price: 19990000,
      originalPrice: 22990000,
      discount: 13,
      rating: 4.9,
      reviewCount: 2100,
      imageUrl: 'https://img.freepik.com/premium-photo/samsung-galaxy-phone_136595-9012.jpg',
      category: 'electronics',
      brand: 'Samsung',
      isNew: true,
    },
    {
      id: 4,
      name: 'Giày Thể Thao Nike Air Max',
      price: 3299000,
      rating: 4.7,
      reviewCount: 1560,
      imageUrl: 'https://img.freepik.com/premium-photo/nike-sneakers_136595-3456.jpg',
      category: 'sports',
      brand: 'Nike',
      isHot: true,
    },
    {
      id: 5,
      name: 'Kem Dưỡng Da Chống Lão Hóa',
      price: 890000,
      rating: 4.5,
      reviewCount: 670,
      imageUrl: 'https://img.freepik.com/premium-photo/anti-aging-cream_136595-7890.jpg',
      category: 'beauty',
      brand: 'L\'Oreal',
    },
    {
      id: 6,
      name: 'Bộ Chăn Ga Gối Cotton',
      price: 1299000,
      originalPrice: 1599000,
      discount: 19,
      rating: 4.4,
      reviewCount: 420,
      imageUrl: 'https://img.freepik.com/premium-photo/bedding-set_136595-2345.jpg',
      category: 'home',
      brand: 'IKEA',
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Tonic Mall
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Khám phá hàng triệu sản phẩm từ các thương hiệu uy tín
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                size="large"
                className="w-full"
              >
                {categories.map(category => (
                  <Option key={category.key} value={category.key}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                size="large"
                className="w-full"
              >
                <Option value="popular">Phổ biến</Option>
                <Option value="newest">Mới nhất</Option>
                <Option value="rating">Đánh giá cao</Option>
                <Option value="price-low">Giá thấp đến cao</Option>
                <Option value="price-high">Giá cao đến thấp</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="px-4">
                <Text strong className="block mb-2">Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Text>
                <Slider
                  range
                  min={0}
                  max={2000000}
                  step={50000}
                  value={priceRange}
                  onChange={setPriceRange}
                  tooltip={{ formatter: (value) => formatPrice(value || 0) }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Featured Brands */}
        <div className="mb-8">
          <Title level={3} className="mb-4">Thương Hiệu Nổi Bật</Title>
          <div className="flex flex-wrap gap-4">
            {brands.map(brand => (
              <Button key={brand} size="large" className="h-12 px-6">
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>
              Sản Phẩm ({sortedProducts.length})
            </Title>
          </div>
          
          <Row gutter={[24, 24]}>
            {sortedProducts.map(product => (
              <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="relative">
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        className="h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && <Tag color="green">Mới</Tag>}
                        {product.isHot && <Tag color="red">Hot</Tag>}
                        {product.isFeatured && <Tag color="blue">Nổi bật</Tag>}
                      </div>
                      {product.discount && (
                        <div className="absolute top-2 right-2">
                          <Tag color="red">-{product.discount}%</Tag>
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    <Button type="text" icon={<HeartOutlined />} />,
                    <Button type="text" icon={<ShoppingCartOutlined />} />,
                  ]}
                >
                  <div className="p-2">
                    <Text className="text-xs text-gray-500 block mb-1">{product.brand}</Text>
                    <Title level={5} className="mb-2 line-clamp-2" style={{ fontSize: '14px' }}>
                      {product.name}
                    </Title>
                    
                    <div className="flex items-center mb-2">
                      <Space>
                        <StarOutlined className="text-yellow-500" />
                        <Text strong>{product.rating}</Text>
                        <Text className="text-gray-500">({product.reviewCount})</Text>
                      </Space>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong className="text-red-500 text-lg">
                          {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && (
                          <Text delete className="text-gray-500 ml-2">
                            {formatPrice(product.originalPrice)}
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    <Link to={`/products/${product.id}`}>
                      <Button type="primary" block className="mt-3">
                        Xem Chi Tiết
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button size="large" type="default">
            Xem Thêm Sản Phẩm
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16">
          <Title level={2} className="text-center mb-8">Tại Sao Chọn Tonic Mall?</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card className="text-center h-full">
                <div className="text-4xl text-blue-500 mb-4">🚚</div>
                <Title level={4}>Giao Hàng Nhanh</Title>
                <Paragraph>
                  Giao hàng trong 1-2 ngày tại TP.HCM và Hà Nội, 3-5 ngày tại các tỉnh thành khác.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center h-full">
                <div className="text-4xl text-green-500 mb-4">🛡️</div>
                <Title level={4}>Bảo Hành Chính Hãng</Title>
                <Paragraph>
                  Tất cả sản phẩm đều có bảo hành chính hãng và chính sách đổi trả linh hoạt.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center h-full">
                <div className="text-4xl text-purple-500 mb-4">💳</div>
                <Title level={4}>Thanh Toán An Toàn</Title>
                <Paragraph>
                  Hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default MallPage;
