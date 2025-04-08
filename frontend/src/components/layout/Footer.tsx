import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Space, Input, Button } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">About Us</Title>
            <Text className="text-gray-300">
              Tonic Store is your one-stop shop for all your needs. We provide high-quality products with excellent customer service.
            </Text>
            <div className="mt-4">
              <Space size="large">
                <a href="#" className="text-gray-300 hover:text-white">
                  <FacebookOutlined className="text-xl" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <InstagramOutlined className="text-xl" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <TwitterOutlined className="text-xl" />
                </a>
              </Space>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">Quick Links</Title>
            <Space direction="vertical" size="middle">
              <Link to="/" className="text-gray-300 hover:text-white block">
                Home
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-white block">
                Products
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-white block">
                Categories
              </Link>
              <Link to="/new-arrivals" className="text-gray-300 hover:text-white block">
                New Arrivals
              </Link>
              <Link to="/deals" className="text-gray-300 hover:text-white block">
                Special Deals
              </Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">Customer Service</Title>
            <Space direction="vertical" size="middle">
              <Link to="/contact" className="text-gray-300 hover:text-white block">
                Contact Us
              </Link>
              <Link to="/faq" className="text-gray-300 hover:text-white block">
                FAQ
              </Link>
              <Link to="/shipping" className="text-gray-300 hover:text-white block">
                Shipping & Returns
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white block">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white block">
                Terms & Conditions
              </Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">Newsletter</Title>
            <Text className="text-gray-300 block mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </Text>
            <Space.Compact className="w-full">
              <Input
                placeholder="Your email address"
                prefix={<MailOutlined className="text-gray-400" />}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button type="primary">Subscribe</Button>
            </Space.Compact>
          </Col>
        </Row>
        <div className="mt-8 border-t border-gray-800 pt-8">
          <Row justify="space-between" align="middle">
            <Col>
              <Text className="text-gray-300">
                &copy; {new Date().getFullYear()} Tonic Store. All rights reserved.
              </Text>
            </Col>
            <Col>
              <Space>
                <img src="/payment/visa.svg" alt="Visa" className="h-6" />
                <img src="/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="/payment/paypal.svg" alt="PayPal" className="h-6" />
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 