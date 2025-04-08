import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
      count: 120,
    },
    {
      id: 2,
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
      count: 85,
    },
    {
      id: 3,
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
      count: 65,
    },
    {
      id: 4,
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80',
      count: 45,
    },
  ];

  return (
    <div className="py-12">
      <Title level={2} className="text-center mb-8">Shop by Category</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link to={`/categories/${category.id}`} key={category.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={category.name}
                  src={category.image}
                  className="h-48 object-cover"
                />
              }
            >
              <div className="text-center">
                <Title level={4} className="mb-1">{category.name}</Title>
                <p className="text-gray-500">{category.count} products</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection; 