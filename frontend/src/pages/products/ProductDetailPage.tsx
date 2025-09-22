import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, Button, notification, Spin, Image, Rate, InputNumber, Tabs, Tag, Space, Divider, Breadcrumb } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined, StarOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Product, ProductStatus } from '../../types';
import ProductReviews from '../../components/product/ProductReviews';
import { ProductService } from '../../services/product/productService';
import WishlistButton from '../../components/home/WishlistButton';
import { formatPrice } from '../../utils/format';
import { getBreadcrumbFromPath } from '../../utils/breadcrumb';

const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  let breadcrumbParent = location.state?.breadcrumb;
  if (!breadcrumbParent && product?.promotionalPrice && product?.promotionalPrice < product?.price) {
    breadcrumbParent = { path: '/flash-sale', label: 'Khuyến mãi' };
  }
  if (!breadcrumbParent) {
    breadcrumbParent = getBreadcrumbFromPath(location.pathname, location.search);
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductService.getProductById(parseInt(id));
          setProduct(data);
          await ProductService.incrementProductView(parseInt(id));
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    try {
      await addToCart(product!, quantity);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500">Không tìm thấy sản phẩm</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6 text-sm text-gray-600">
        <Breadcrumb.Item>
          <Link to="/" className="hover:text-blue-500">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={breadcrumbParent.path} className="hover:text-blue-500">{breadcrumbParent.label}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>
  
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Left: Image */}
        <div>
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="rounded-md"
          />
        </div>
  
        {/* Right: Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
  
          <div className="flex items-center space-x-2">
            <Rate disabled value={Math.round(product.rating || 0)} />
            <span className="ml-2 font-semibold text-yellow-600">{product.rating?.toFixed(1) || 0}/5</span>
            <span className="text-gray-500 text-sm ml-2">({product.reviewCount} đánh giá)</span>
          </div>
  
          <div className="flex items-center space-x-4">
            {product.promotionalPrice && product.promotionalPrice < product.price ? (
              <>
                <span className="text-2xl font-bold text-red-500">
                  {formatPrice(product.promotionalPrice)}
                </span>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-500">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
  
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
  
          <div className="flex items-center gap-4">
            <span className="font-medium">Số lượng:</span>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
            />
            <span className="text-gray-500 text-sm">{product.stock} sản phẩm có sẵn</span>
          </div>
  
          <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={product.status === ProductStatus.OUT_OF_STOCK}
            >
              {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </Button>
  
            <WishlistButton
              productId={product.id}
              showText={true}
              className="!h-10 !px-4"
            />
          </div>
  
          <div className="space-y-1 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <EyeOutlined />
              <span>{product.viewCount} Lượt xem</span>
            </div>
            <div className="flex items-center gap-2">
              <FireOutlined />
              <span>{product.soldCount} Đã bán</span>
            </div>
            {product.isFeatured && (
              <div className="flex items-center gap-2 text-yellow-500">
                <StarOutlined />
                <span>Sản phẩm nổi bật</span>
              </div>
            )}
            {product.isNew && (
              <div className="flex items-center gap-2 text-blue-500">
                <GiftOutlined />
                <span>Sản phẩm mới</span>
              </div>
            )}
            {product.isBestSeller && (
              <div className="flex items-center gap-2 text-red-500">
                <FireOutlined />
                <span>Bán chạy nhất</span>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Tabs */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Mô tả sản phẩm" key="1">
            <div className="prose max-w-none text-gray-700">{product.description}</div>
          </TabPane>
          <TabPane tab="Thông số kỹ thuật" key="2">
            <div className="space-y-4 text-gray-700">
              {product.sku && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Mã sản phẩm:</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.barcode && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Mã vạch:</span>
                  <span>{product.barcode}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Khối lượng:</span>
                  <span>{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Kích thước:</span>
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Chất liệu:</span>
                  <span>{product.material}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Xuất xứ:</span>
                  <span>{product.origin}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Bảo hành:</span>
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab="Đánh giá" key="3">
            <ProductReviews productId={product.id} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage; 