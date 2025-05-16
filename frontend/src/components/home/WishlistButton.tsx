import React from 'react';
import { Button, notification } from 'antd';
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
      notification.success({
        message: 'Thành công',
        description: isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật danh sách yêu thích',
        placement: 'topRight',
        duration: 2,
      });
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
      {showText && (isInWishlist ? 'Xóa yêu thích' : 'Yêu thích')}
    </Button>
  );
};

export default WishlistButton; 