import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Menu,
  Badge,
  Dropdown,
  notification,
  Popover,
  Space
} from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  DeleteOutlined,
  MobileOutlined,
  DownOutlined,
  QrcodeOutlined,
  BellOutlined,
  CarOutlined,
  FacebookFilled,
  InstagramFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import { ProductService } from '../../services/product/productService';
import { CategoryService } from '../../services/category/categoryService';
import type { Category } from '../../types';
import { NotificationService } from '../../services/notification/notificationService';

interface Notification {
  id: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cart, totalItems, removeFromCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getCategories();
        setCategories(data);
      } catch (error) {
        // Có thể xử lý lỗi ở đây nếu muốn
      }
    };
    fetchCategories();

    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const notifications = await NotificationService.getNotifications();
          setNotifications(notifications);
          setUnreadNotificationCount(notifications.filter((n: { isRead: any; }) => !n.isRead).length);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  const menuItems = [
    { key: 'home', label: 'Trang chủ', path: '/' },
    { key: 'products', label: 'Sản phẩm', path: '/products' },
    { key: 'flash-sale', label: 'Khuyến mãi', path: '/flash-sale' },
    { key: 'promotion-codes', label: 'Mã giảm giá', path: '/promotion-codes' },
    { key: 'new-arrivals', label: 'Hàng mới về', path: '/new-arrivals' },
    { key: 'brands', label: 'Thương hiệu', path: '/brands' },
    { key: 'blog', label: 'Tonic Store Blog', path: '/blog' },
    { key: 'contact', label: 'Liên hệ', path: '/contact' },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="/user/profile" className="flex items-center">
          <UserOutlined className="mr-2" />
          Hồ sơ
        </Link>
      )
    },
    {
      key: 'orders',
      label: (
        <Link to="/user/orders" className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Đơn hàng của tôi
        </Link>
      )
    },
    {
      key: 'wishlist',
      label: (
        <Link to="/wishlist" className="flex items-center">
          <HeartOutlined className="mr-2" />
          Yêu thích
        </Link>
      )
    },
    ...(user?.role === 'DELIVERY' ? [{
      key: 'shipper-orders',
      label: (
        <Link to="/shipper/orders" className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Quản lý giao hàng
        </Link>
      )
    }] : []),
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className="flex items-center text-red-500" onClick={() => logout()}>
          <LogoutOutlined className="mr-2" />
          Đăng xuất
        </span>
      ),
    }
  ];

  const selectedKey = location.pathname.split('/')[1] || 'home';

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        setIsSearching(true);
        const results = await ProductService.searchProducts(searchQuery.trim());
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { state: { results } });
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi xảy ra khi tìm kiếm sản phẩm',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  const cartContent = (
    <div className="w-80 max-h-96 overflow-y-auto">
      {cart.items.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Giỏ hàng trống
        </div>
      ) : (
        <div className="divide-y">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center space-x-4">
              <img
                src={item.product.imageUrl || 'https://via.placeholder.com/50'}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-gray-500">
                  {formatPrice(item.product.price)} x {item.quantity}
                </div>
              </div>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeFromCart(item.id)}
              />
            </div>
          ))}
        </div>
      )}
      {cart.items.length > 0 && (
        <div className="p-4 border-t">
          <Button
            type="primary"
            block
            onClick={() => navigate('/cart')}
          >
            Xem giỏ hàng
          </Button>
        </div>
      )}
    </div>
  );

  const notificationContent = (
    <div className="w-80 max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Không có thông báo nào
        </div>
      ) : (
        <div className="divide-y">
          {notifications.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 hover:bg-gray-100 cursor-pointer ${!item.isRead ? 'font-semibold' : ''}`}
              onClick={() => item.link && navigate(item.link)}
            >
              <div className="text-sm">{item.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
      {notifications.length > 0 && (
        <div className="p-4 border-t">
          <Button
            type="primary"
            block
            onClick={() => navigate('/notifications')}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-100 py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <MobileOutlined className="mr-1" />
                Tải ứng dụng
              </Link>
              {isAuthenticated ? (
                <Dropdown menu={{ items: userMenuItems }}>
                  <span className="cursor-pointer">
                    Xin chào, {user?.name} <DownOutlined />
                  </span>
                </Dropdown>
              ) : (
                <Space>
                  <Link to="/login">Đăng nhập</Link>
                  <Link to="/register">Đăng ký</Link>
                </Space>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/help">Trung tâm hỗ trợ</Link>
               {/* Liên kết mạng xã hội */}
              <div className="flex items-center space-x-2">
                <span>Kết nối</span>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FacebookFilled className="text-blue-600 text-lg hover:text-blue-800" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <InstagramFilled className="text-pink-500 text-lg hover:text-pink-600" />
                </a>
              </div>

              <div className="relative group">
                <span className="flex items-center cursor-pointer">
                  <QrcodeOutlined className="mr-1" />
                  Quét mã QR
                </span>
                <div className="hidden group-hover:block absolute right-0 p-2 bg-white shadow-lg rounded">
                  <div className="w-32 h-32 bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <span className="text-2xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-blue-600 transition-all duration-500">
                Tonic Store
              </span>
            </Link>

            {/* Search block */}
            <div className="flex flex-col flex-1 max-w-xl lg:max-w-2xl">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined className={`text-gray-400 ${isSearching ? 'animate-spin' : ''}`} />}
                className="w-full px-4 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                disabled={isSearching}
              />
              {/* Suggestions row */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              <Link to="/user/orders" className="hidden md:flex items-center text-gray-600 hover:text-blue-500">
                <CarOutlined className="text-sm" />
                <span className="hidden md:inline ml-2">Theo dõi đơn hàng</span>
              </Link>

              <Popover content={notificationContent} trigger="hover" placement="bottomRight">
                <Link to="/notifications" className="hidden md:flex items-center text-gray-600 hover:text-blue-500">
                  <Badge dot={unreadNotificationCount > 0}>
                    <BellOutlined className="text-sm" />
                  </Badge>
                  <span className="hidden md:inline ml-2">Thông báo của tôi</span>
                </Link>
              </Popover>

              <Link to="/wishlist" className="hidden md:flex items-center text-gray-600 hover:text-blue-500">
                <Badge dot>
                  <HeartOutlined className="text-sm" />
                </Badge>
                <span className="hidden md:inline ml-2">Yêu thích</span>
              </Link>

              <Popover content={cartContent} trigger="hover" placement="bottomRight">
                <Link to="/cart" className="flex items-center text-gray-600 hover:text-blue-500">
                  <Badge count={totalItems}>
                    <ShoppingCartOutlined className="text-xl" />
                  </Badge>
                  <span className="hidden md:inline ml-2">Giỏ hàng</span>
                </Link>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <Menu 
            mode="horizontal" 
            selectedKeys={[selectedKey]}
            className="border-none"
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
