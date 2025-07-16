import React from 'react';
import { message, Spin } from 'antd';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/product/ProductCard';

const WishlistPage: React.FC = () => {
  const { wishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, 1);
      message.success('Product added to cart');
    } catch (error) {
      message.error('Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {wishlist.map((item) => {
            const p = item.product;
            const mappedProduct = {
              id: p.id,
              name: p.name,
              description: 'Không có mô tả',
              price: p.price,
              promotionalPrice: (p as any).promotionalPrice ?? undefined,
              stock: (p as any).stock ?? 0,
              imageUrl: p.imageUrl,
              categoryId: (p.category && (p.category as any).id) ? (p.category as any).id : 0,
              category: p.category ? {
                id: (p.category as any).id ?? 0,
                name: p.category.name,
                description: (p.category as any).description ?? '',
                imageUrl: (p.category as any).imageUrl ?? '',
                parentId: (p.category as any).parentId ?? null,
                products: [],
                createdAt: (p.category as any).createdAt ?? '',
                updatedAt: (p.category as any).updatedAt ?? '',
              } : undefined,
              status: (p as any).status ?? 'ACTIVE',
              sku: (p as any).sku ?? '',
              barcode: (p as any).barcode ?? '',
              weight: (p as any).weight ?? 0,
              dimensions: (p as any).dimensions ?? '',
              material: (p as any).material ?? '',
              origin: (p as any).origin ?? '',
              warranty: (p as any).warranty ?? '',
              seoTitle: (p as any).seoTitle ?? '',
              seoDescription: (p as any).seoDescription ?? '',
              seoUrl: (p as any).seoUrl ?? '',
              isFeatured: (p as any).isFeatured ?? false,
              isNew: (p as any).isNew ?? false,
              isBestSeller: (p as any).isBestSeller ?? false,
              rating: (p as any).rating ?? 0,
              reviewCount: (p as any).reviewCount ?? 0,
              viewCount: (p as any).viewCount ?? 0,
              soldCount: (p as any).soldCount ?? 0,
              createdAt: (p as any).createdAt ?? '',
              updatedAt: (p as any).updatedAt ?? '',
              cartItems: [],
              orderItems: [],
              reviews: [],
            };
            return (
              <div key={item.id} className="relative group">
                <ProductCard 
                  product={mappedProduct}
                  onAddToCart={handleAddToCart}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;