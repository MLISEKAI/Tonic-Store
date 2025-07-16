import React from 'react';
import { Rate, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import WishlistButton from '../home/WishlistButton';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  breadcrumb?: { path: string; label: string };
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, breadcrumb }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let fromMenu;
    if (breadcrumb?.path === '/flash-sale') fromMenu = 'flash-sale';
    else if (breadcrumb?.path === '/featured-products') fromMenu = 'featured-products';
    else if (breadcrumb?.path === '/best-sellers') fromMenu = 'best-sellers';
    else if (breadcrumb?.path === '/new-arrivals') fromMenu = 'new-arrivals';
    else if (breadcrumb?.path === '/products') fromMenu = 'products';
    else if (breadcrumb?.path === '/categories') fromMenu = 'categories';
    if (fromMenu) {
      navigate(`/products/${product.id}?from=${fromMenu}`, { state: { breadcrumb, fromMenu } });
    } else {
      navigate(`/products/${product.id}`, { state: { breadcrumb } });
    }
  };

  // const handleAddToCart = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (onAddToCart) {
  //     onAddToCart(product);
  //   }
  // };

  return (
    <div
      className="rounded-xl border hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Hình ảnh và nút Wishlist */}
      <div className="relative">
      <img
          alt={product.name}
          src={product.imageUrl}
          className="w-full h-[180px] object-cover"
        />
        <WishlistButton
          productId={product.id}
          showText={false}
          className="!p-1.5 absolute top-2 right-2"
        />
      </div>
    
      <div className="p-3 space-y-2">
        {/* Tên sản phẩm */}
        <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate" onClick={handleClick}>
          {product.name}
        </h3>
    
        {/* Tags */}
        <div className="flex gap-1 flex-wrap">
          {product.promotionalPrice && product.promotionalPrice < product.price ? (
            <>
              <Tag color="blue" className="text-xs">Mới</Tag>
              <Tag color="gold">Nổi bật</Tag>
              <Tag color="red" className="text-xs">Bán chạy</Tag>
            </>
          ) : (
            <>
              {product.isNew && <Tag color="blue" className="text-xs">Mới</Tag>}
              {product.isFeatured && <Tag color="gold">Nổi bật</Tag>}
              {product.isBestSeller && <Tag color="red" className="text-xs">Bán chạy</Tag>}
            </>
          )}
        </div>
    
        {/* Đánh giá */}
        <div className="flex items-center text-xs md:text-sm">
          <Rate disabled defaultValue={product.rating || 0} className="text-xs" />
          <span className="ml-1 text-gray-500">({product.reviewCount || 0})</span>
        </div>
    
        {/* Giá sản phẩm */}
        <div>
          {product.promotionalPrice && product.promotionalPrice < product.price ? (
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-red-500">
                {formatPrice(product.promotionalPrice)}
              </div>
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </div>
              <div className="text-xs text-red-500 bg-red-100 px-1 py-0.5 rounded">
                -3%
              </div>
            </div>
          ) : (
            <span className="text-lg font-bold text-red-500">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
    
        {/* Số lượng đã bán */}
        <div className="flex justify-between items-center pt-1">
          <div className="text-gray-500 text-xs md:text-sm">
            Đã bán: {product.soldCount || 0}
          </div>
          {/* <Button
            type="primary"
            size="small"
            className='!p-4 rounded-lg'
            icon={<ShoppingCartOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
            disabled={product.status === ProductStatus.OUT_OF_STOCK}
          >
            {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 