import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { WishlistService } from '../services/wishlist/wishlistService';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className, showText = true }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const { isInWishlist } = await WishlistService.checkWishlistStatus(productId);
      setIsInWishlist(isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      setLoading(true);
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(productId);
        message.success('Removed from wishlist');
      } else {
        await WishlistService.addToWishlist(productId);
        message.success('Added to wishlist');
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      message.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type={isInWishlist ? 'primary' : 'default'}
      icon={isInWishlist
        ? <HeartFilled className={!showText ? 'text-xl' : ''} />
        : <HeartOutlined className={!showText ? 'text-xl' : ''} />}
      onClick={e => {
        e.stopPropagation();
        handleToggleWishlist();
      }}
      loading={loading}
      className={className}
    >
      {showText && (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </Button>
  );
};

export default WishlistButton; 