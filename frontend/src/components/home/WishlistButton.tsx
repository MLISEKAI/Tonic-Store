import React from 'react';
import { Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useWishlist } from '../../hooks/useWishlist';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className, showText = true }) => {
  const { isInWishlist, loading, toggleWishlist } = useWishlist(productId);

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist();
      message.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      message.error('Failed to update wishlist');
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