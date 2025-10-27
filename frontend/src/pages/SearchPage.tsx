import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Empty, Spin, Card, Button, notification, Select, Checkbox, Rate, Row, Col, InputNumber } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { ProductService } from '../services/product/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const query = new URLSearchParams(location.search).get('q') || '';

  // State cho filter
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [category, setCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [sort, setSort] = useState<string>('connection');
  const [inStock, setInStock] = useState<boolean | undefined>();
  const [rating, setRating] = useState<number>(0);

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getCategories();
        setCategories(res.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (error) {
        notification.error({ message: 'Lỗi', description: 'Không lấy được danh mục', duration: 2 });
      }
    };
    fetchCategories();
  }, []);

  // Lấy sản phẩm với filter hoặc tìm kiếm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let results: Product[] = [];
        if (query) {
          results = await ProductService.searchProducts(query);
        } else {
          const params: any = {};
          if (category) params.category = category;
          if (priceRange[0] > 0) params.minPrice = priceRange[0];
          if (priceRange[1] < 50000000) params.maxPrice = priceRange[1];
          if (inStock !== undefined) params.status = inStock ? 'ACTIVE' : 'OUT_OF_STOCK';
          results = await ProductService.getProducts(params);
        }
        let sorted = [...results];
        if (sort === 'price_asc') sorted.sort((a, b) => Number(a.price) - Number(b.price));
        if (sort === 'price_desc') sorted.sort((a, b) => Number(b.price) - Number(a.price));
        if (sort === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
        if (sort === 'name_desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
        if (sort === 'newest') sorted.sort((a, b) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0));
        if (sort === 'bestseller') sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        // Lọc rating theo yêu cầu UX
        if (rating > 0) {
          if (rating === 5) {
            sorted = sorted.filter((p) => Math.round(p.rating || 0) === 5);
          } else {
            sorted = sorted.filter((p) => (p.rating || 0) >= rating);
          }
        }
        setProducts(sorted);
      } catch (error) {
        notification.error({ message: 'Lỗi', description: 'Không lấy được sản phẩm', duration: 2 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category, priceRange, sort, inStock, rating]);

  const handleAddToCart = async (product: Product) => {
    try {
      if (!isAuthenticated) {
        notification.warning({ message: 'Thông báo', description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', duration: 2 });
        navigate('/');
        return;
      }
      await addToCart(product, 1);
      notification.success({ message: 'Thành công', description: 'Đã thêm sản phẩm vào giỏ hàng', duration: 2 });
    } catch (error) {
      notification.error({ message: 'Lỗi', description: 'Thêm sản phẩm vào giỏ hàng thất bại', duration: 2 });
    }
  };

  const handleProductClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };

  const ratingOptions = [5, 4, 3, 2, 1];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Kết quả tìm kiếm cho "{query}"</h1>
        <div style={{ minWidth: 220 }}>
          <Select
            style={{ width: '100%' }}
            allowClear
            value={sort}
            onChange={value => setSort(value || 'connection')}
            options={[
              { value: 'connection', label: 'Liên quan' },
              { value: 'price_asc', label: 'Giá tăng dần' },
              { value: 'price_desc', label: 'Giá giảm dần' },
              { value: 'name_asc', label: 'Tên A-Z' },
              { value: 'name_desc', label: 'Tên Z-A' },
              { value: 'newest', label: 'Mới nhất' },
              { value: 'bestseller', label: 'Bán chạy' },
            ]}
          />
        </div>
      </div>

      <Row gutter={24}>
        {/* BỘ LỌC TÌM KIẾM (SIDEBAR) */}
        <Col xs={24} sm={6} md={6} lg={5}>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Bộ lọc tìm kiếm</h2>

            <div className="mb-4">
              <div className="font-semibold mb-2">Danh mục</div>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
                allowClear
                value={category}
                onChange={setCategory}
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
              />
            </div>

            <div className="mb-4">
              <div className="font-semibold mb-2">Khoảng giá (VNĐ)</div>
              <div className="flex items-center gap-2">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={50000}
                  placeholder="Từ"
                  value={priceRange[0]}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => {
                    const num = value ? value.replace(/\D/g, '') : '';
                    return num ? parseInt(num, 10) : 0;
                  }}
                  onChange={(value) => {
                    if (value !== null && value <= priceRange[1]) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                />
                <span>-</span>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={50000}
                  placeholder="Đến"
                  value={priceRange[1]}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => {
                    const num = value ? value.replace(/\D/g, '') : '';
                    return num ? parseInt(num, 10) : 0;
                  }}
                  onChange={(value) => {
                    if (value !== null && value >= priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="font-semibold mb-2">Tình trạng</div>
              <Checkbox
                checked={inStock === true}
                onChange={(e) => setInStock(e.target.checked ? true : undefined)}
              >
                Còn hàng
              </Checkbox>
            </div>

            <div className="mb-4">
              <div className="font-semibold mb-3">Đánh giá</div>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((value) => (
                  <Button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`!px-4 !py-2 !rounded-lg flex items-center gap-2 
                      border ${rating === value ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400'} 
                      bg-white text-gray-800`}
                    type="default"
                  >
                    <Rate disabled value={value} />
                    {value < 5 && <span className="text-sm text-gray-600">trở lên</span>}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="font-semibold mb-2 text-gray-400">Thương hiệu (chưa hỗ trợ)</div>
              <Select style={{ width: '100%' }} placeholder="Chọn thương hiệu" disabled />
            </div>
          </div>
        </Col>

        {/* KẾT QUẢ TÌM KIẾM */}
        <Col xs={24} sm={18} md={18} lg={19}>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Spin size="large" />
            </div>
          ) : products.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm nào" className="my-8" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                          <div className="flex items-center gap-2 mt-1">
                            <Rate disabled value={Math.round(product.rating || 0)} />
                            <span className="text-xs text-gray-500">
                              ({product.rating?.toFixed(1) || 0})
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-blue-600 mt-2">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
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
                        // xử lý yêu thích
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
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage; 