import { FC, useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Spin, notification } from 'antd';
import { CategoryService } from '../services/category/categoryService';
import { ProductService } from '../services/product/productService';
import { CartService } from '../services/carts/cartService';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import { getBreadcrumbFromPath } from '../utils/breadcrumb';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const CategoriesPage: FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname, location.search);
  const selectedCategory = searchParams.get('category');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          CategoryService.getCategories(),
          ProductService.getProducts(undefined)
        ]);

        // Tính số lượng sản phẩm cho từng loại
        const categoriesWithCount = categoriesData.map((category: Category) => ({
          ...category,
          productCount: productsData.filter((product: Product) => product.category?.name === category.name).length
        }));

        setCategories(categoriesWithCount);
        setProducts(productsData);
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách danh mục',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await CartService.addToCart(product.id, 1);
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
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category?.name === selectedCategory)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {selectedCategory ? `Sản phẩm trong danh mục: ${selectedCategory}` : 'Danh mục sản phẩm'}
      </h1>

      {selectedCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              breadcrumb={breadcrumb}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={`/categories?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center justify-center text-center group">
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {category.productCount} sản phẩm
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 