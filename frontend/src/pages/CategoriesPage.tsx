import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, message } from 'antd';
import { getCategories, getProducts } from '../services/api';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

interface Product {
  id: number;
  name: string;
  category?: {
    name: string;
  };
}

const CategoriesPage: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts()
        ]);

        // Calculate product count for each category
        const categoriesWithCount = categoriesData.map((category: Category) => ({
          ...category,
          productCount: productsData.filter((product: Product) => product.category?.name === category.name).length
        }));

        setCategories(categoriesWithCount);
      } catch (error) {
        message.error('Không thể tải danh sách danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Danh mục sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            to={`/products?category=${encodeURIComponent(category.name)}`}
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
    </div>
  );
};

export default CategoriesPage; 