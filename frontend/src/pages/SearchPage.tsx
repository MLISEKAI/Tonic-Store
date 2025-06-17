import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Empty, Spin, Card, Button, notification } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { ProductService } from '../services/product/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { CartService } from '../services/carts/cartService';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const results = await ProductService.searchProducts(query);
        setProducts(results);
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi xảy ra khi tìm kiếm sản phẩm',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleAddToCart = async ( product: Product) => {
    try {
      if (!isAuthenticated) {
        notification.warning({
          message: 'Thông báo',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          placement: 'topRight',
          duration: 2,
        });
        navigate('/login');
        return;
      }
      await addToCart(product, 1);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Thêm sản phẩm vào giỏ hàng thất bại',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const handleProductClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho "{query}"
      </h1>

      {products.length === 0 ? (
        <Empty
          description="Không tìm thấy sản phẩm nào"
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              hoverable
              className="cursor-pointer"
            >
              <div onClick={(e) => handleProductClick(e, product.id)}>
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className="h-48 w-full object-cover"
                />
                <Card.Meta
                  title={product.name}
                  description={
                    <div>
                      <p className="text-gray-500 line-clamp-2">{product.description}</p>
                      <p className="text-lg font-semibold text-blue-600 mt-2">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(Number(product.price))}
                      </p>
                    </div>
                  }
                />
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  icon={<HeartOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Xử lý yêu thích
                  }}
                />
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 