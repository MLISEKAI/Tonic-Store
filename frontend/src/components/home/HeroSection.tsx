import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Hero background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-32">
        <div className="max-w-2xl">
          <Title level={1} className="text-white mb-4">
            Discover Amazing Products
          </Title>
          <Text className="text-white text-lg mb-8 block">
            Shop the latest trends and find the perfect items for your needs. Quality products at affordable prices.
          </Text>
          <Button
            type="primary"
            size="large"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Shop Now <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 