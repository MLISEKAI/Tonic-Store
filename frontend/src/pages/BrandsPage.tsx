import React from 'react';
import { Typography, Row, Col, Card, Space, Tag } from 'antd';
import { ShopOutlined, GlobalOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  country: string;
  establishedYear: number;
  productCount: number;
  isFeatured: boolean;
}

// Temporary mock data - will be replaced with API call
const brands: Brand[] = [
  {
    id: 1,
    name: 'Apple',
    logo: 'https://example.com/apple-logo.png',
    description: 'Apple Inc. là một tập đoàn công nghệ đa quốc gia của Mỹ có trụ sở chính tại Cupertino, California.',
    country: 'Mỹ',
    establishedYear: 1976,
    productCount: 25,
    isFeatured: true
  },
  {
    id: 2,
    name: 'Samsung',
    logo: 'https://example.com/samsung-logo.png',
    description: 'Samsung Electronics là một tập đoàn điện tử đa quốc gia có trụ sở tại Seoul, Hàn Quốc.',
    country: 'Hàn Quốc',
    establishedYear: 1969,
    productCount: 30,
    isFeatured: true
  },
  {
    id: 3,
    name: 'Sony',
    logo: 'https://example.com/sony-logo.png',
    description: 'Sony Corporation là một tập đoàn đa quốc gia của Nhật Bản chuyên về điện tử, giải trí và công nghệ.',
    country: 'Nhật Bản',
    establishedYear: 1946,
    productCount: 20,
    isFeatured: true
  },
  {
    id: 4,
    name: 'LG',
    logo: 'https://example.com/lg-logo.png',
    description: 'LG Electronics là một tập đoàn điện tử đa quốc gia của Hàn Quốc.',
    country: 'Hàn Quốc',
    establishedYear: 1958,
    productCount: 15,
    isFeatured: false
  }
];

const BrandsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Thương Hiệu</Title>
      <Paragraph>
        Khám phá các thương hiệu nổi tiếng và uy tín tại Tonic Store. Chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng từ các thương hiệu hàng đầu thế giới.
      </Paragraph>

      <Row gutter={[24, 24]}>
        {brands.map((brand) => (
          <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: '200px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  padding: '20px'
                }}>
                  <img
                    alt={brand.name}
                    src={brand.logo}
                    style={{ 
                      maxWidth: '80%', 
                      maxHeight: '80%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              }
            >
              <Card.Meta
                title={
                  <Space>
                    {brand.name}
                    {brand.isFeatured && <Tag color="gold"><StarOutlined /> Nổi bật</Tag>}
                  </Space>
                }
                description={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Paragraph ellipsis={{ rows: 2 }}>{brand.description}</Paragraph>
                    <Space>
                      <Tag icon={<GlobalOutlined />}>{brand.country}</Tag>
                      <Tag icon={<ShopOutlined />}>{brand.productCount} sản phẩm</Tag>
                    </Space>
                    <div style={{ color: '#666' }}>
                      Thành lập: {brand.establishedYear}
                    </div>
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

export default BrandsPage; 