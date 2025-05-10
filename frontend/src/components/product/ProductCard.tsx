import React from 'react';
import { Card, Rate, Button, Tag } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import WishlistButton from '../WishlistButton';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <img
          alt={product.name}
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          className="h-48 object-cover"
          onClick={handleClick}
        />
      }
      onClick={handleClick}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <div className="flex space-x-1">
            {product.isNew && <Tag color="blue">Mới</Tag>}
            {product.isFeatured && <Tag color="gold">Nổi bật</Tag>}
            {product.isBestSeller && <Tag color="red">Bán chạy</Tag>}
          </div>
        </div>

        <div className="flex items-center">
          <Rate disabled defaultValue={product.rating || 0} />
          <span className="ml-2 text-gray-500 text-sm">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-red-500">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">
            Đã bán: {product.soldCount || 0}
          </span>
          <div className="flex space-x-2">
            <WishlistButton productId={product.id} showText={false} className="!p-2" />
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={product.status === ProductStatus.OUT_OF_STOCK}
            >
              {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard; 