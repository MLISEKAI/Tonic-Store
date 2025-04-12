import { FC } from 'react';

const CategoriesPage: FC = () => {
  const categories = [
    { id: 1, name: 'Điện tử', count: 12 },
    { id: 2, name: 'Phụ kiện', count: 8 },
    { id: 3, name: 'Đồ gia dụng', count: 15 },
    { id: 4, name: 'Thời trang', count: 20 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <p className="text-gray-600">{category.count} sản phẩm</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage; 