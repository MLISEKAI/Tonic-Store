import React from 'react';
import { Button, Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import WishlistButton from '../home/WishlistButton';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  breadcrumb?: { path: string; label: string }[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, breadcrumb }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    let fromMenu;
    if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) { 
      const lastPath = breadcrumb[breadcrumb.length - 1].path;
      if (lastPath === '/flash-sale') fromMenu = 'flash-sale';
      else if (lastPath === '/featured-products') fromMenu = 'featured-products';
      else if (lastPath === '/best-sellers') fromMenu = 'best-sellers';
      else if (lastPath === '/new-arrivals') fromMenu = 'new-arrivals';
      else if (lastPath === '/products') fromMenu = 'products';
      else if (lastPath === '/categories') fromMenu = 'categories';
    }
  
    if (fromMenu) {
      navigate(`/products/${product.id}`, { state: { fromMenu, breadcrumb } });
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
      className="rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Hình ảnh và nút Wishlist */}
      <div className="relative">
        <img
          alt={product.name}
          src={product.imageUrl}
          className="w-full h-[180px] object-cover"
        />
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton
            productId={product.id}
            showText={false}
            className="!w-8 !h-8 !min-w-0 !p-0 !rounded-full !bg-white/80 hover:!bg-white !border-none !shadow-md flex items-center justify-center"
          />
        </div>
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
    
        {/* Số lượng đã bán và nút thêm vào giỏ */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Đã bán {product.soldCount || 0}
          </div>
          <Button
            type="primary"
            size="small"
            className="!h-8 !px-3 !rounded-full !bg-blue-500 hover:!bg-blue-600 !border-none !text-xs !font-medium !shadow-sm hover:!shadow-md transition-all"
            icon={<ShoppingCartOutlined className="text-sm" />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={product.status === ProductStatus.OUT_OF_STOCK}
          >
            {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 