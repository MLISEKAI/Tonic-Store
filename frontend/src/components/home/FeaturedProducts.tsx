import { Card, Typography, Button, Rate } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Meta } = Card;

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 149.99,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80',
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 129.99,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
    },
  ];

  return (
    <div className="py-12">
      <Title level={2} className="text-center mb-8">Featured Products</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
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
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts; 