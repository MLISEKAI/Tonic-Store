import { Button, Input } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Home = () => {

  const products = [
    {
      id: 1,
      name: 'Tai nghe cao cấp',
      price: 199.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    },
    {
      id: 2,
      name: 'Tai nghe không dây',
      price: 149.99,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&q=80',
    },
    {
      id: 3,
      name: 'Đồng hồ thông minh',
      price: 299.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
    },
    {
      id: 4,
      name: 'Loa Bluetooth',
      price: 129.99,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=400&q=80',
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Điện tử',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
      count: 120,
    },
    {
      id: 2,
      name: 'Thời trang',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
      count: 85,
    },
    {
      id: 3,
      name: 'Nhà cửa & Đời sống',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
      count: 65,
    },
    {
      id: 4,
      name: 'Thể thao',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
      count: 45,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative px-6 py-12 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-white mb-4 text-4xl sm:text-5xl font-bold">
              Khám phá sản phẩm tuyệt vời
            </h1>
            <p className="text-white text-lg mb-8 opacity-90">
              Mua sắm những xu hướng mới nhất và tìm kiếm những sản phẩm phù hợp với nhu cầu của bạn. Sản phẩm chất lượng với giá cả phải chăng.
            </p>
            <Button
              type="primary"
              size="large"
              className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8 text-lg"
              icon={<ArrowRightOutlined />}
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="ml-2 text-gray-500">({product.rating})</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">${product.price}</p>
                </div>
                <div className="flex border-t">
                  <button className="flex-1 p-3 text-gray-600 hover:text-red-500 transition-colors">
                    <HeartOutlined className="text-lg" />
                  </button>
                  <button className="flex-1 p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <ShoppingCartOutlined className="mr-2" />
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-3xl font-bold">Mua sắm theo danh mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link to={`/categories/${category.id}`} key={category.id} className="block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={category.name}
                      src={category.image}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.count} sản phẩm</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 