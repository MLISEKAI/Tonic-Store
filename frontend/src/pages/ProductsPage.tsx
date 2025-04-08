import { Card, Typography, Button, Rate, Input, Select, Row, Col } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

const ProductsPage = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 149.99,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 129.99,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Electronics',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Title level={2}>All Products</Title>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Search
            placeholder="Search products..."
            allowClear
            className="w-full md:w-64"
          />
          <Select
            placeholder="Category"
            className="w-full md:w-48"
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'fashion', label: 'Fashion' },
              { value: 'home', label: 'Home & Living' },
              { value: 'sports', label: 'Sports' },
            ]}
          />
          <Button icon={<FilterOutlined />}>
            Filters
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col xs={24} sm={12} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <Button type="text" icon={<HeartOutlined />} />,
                <Button type="primary" icon={<ShoppingCartOutlined />}>
                  Add to Cart
                </Button>,
              ]}
            >
              <Meta
                title={product.name}
                description={
                  <div>
                    <div className="flex items-center mb-2">
                      <Rate disabled defaultValue={product.rating} className="text-sm" />
                      <Text className="ml-2 text-gray-500">({product.rating})</Text>
                    </div>
                    <Text className="text-lg font-semibold">${product.price}</Text>
                    <Text className="block text-gray-500">{product.category}</Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductsPage;
