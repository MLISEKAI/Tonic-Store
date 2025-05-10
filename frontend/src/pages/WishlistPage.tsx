import React, { useEffect, useState } from 'react';
import { Card, Button, message, Empty } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { WishlistService } from '../services/wishlist/wishlistService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: {
      name: string;
    };
  };
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await WishlistService.getWishlist();
      setWishlist(data);
    } catch (error) {
      message.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await WishlistService.removeFromWishlist(productId);
      message.success('Product removed from wishlist');
      loadWishlist();
    } catch (error) {
      message.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: WishlistItem['product']) => {
    try {
      await addToCart(product, 1);
      message.success('Product added to cart');
    } catch (error) {
      message.error('Failed to add to cart');
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          description="Your wishlist is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <Card
            key={item.id}
            hoverable
            cover={
              <img
                alt={item.product.name}
                src={item.product.imageUrl}
                className="h-48 object-cover cursor-pointer"
                onClick={() => handleProductClick(item.product.id)}
              />
            }
            actions={[
              <Button
                key="cart"
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(item.product)}
              >
                Add to Cart
              </Button>,
              <Button
                key="remove"
                danger
                icon={<HeartOutlined />}
                onClick={() => handleRemoveFromWishlist(item.product.id)}
              >
                Remove
              </Button>
            ]}
          >
            <Card.Meta
              title={
                <div 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleProductClick(item.product.id)}
                >
                  {item.product.name}
                </div>
              }
              description={
                <div>
                  <p className="text-gray-600">{item.product.category.name}</p>
                  <p className="text-lg font-bold mt-2">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.product.price)}
                  </p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage; 