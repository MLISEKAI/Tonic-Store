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
} from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  DeleteOutlined,
  CarOutlined,
  BellOutlined,
  MenuOutlined,
  CloseOutlined,
  CreditCardOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import { ProductService } from '../../services/product/productService';
import { CategoryService } from '../../services/category/categoryService';
import type { Category } from '../../types';
import { NotificationService } from '../../services/notification/notificationService';
import { useWishlist } from '../../contexts/WishlistContext';
import type { Notification } from '../../types';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cart, totalItems, removeFromCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const { wishlist } = useWishlist();
  const state = location.state;
  const params = new URLSearchParams(location.search);

  let selectedKey = 'home';
  if (state?.fromMenu) {
    selectedKey = state.fromMenu;
  } else if (params.get('from')) {
    selectedKey = params.get('from')!;
  } else if (location.pathname.startsWith('/products')) {
    selectedKey = 'products';
  } else if (location.pathname.startsWith('/flash-sale')) {
    selectedKey = 'flash-sale';
  } else if (location.pathname.startsWith('/featured-products')) {
    selectedKey = 'featured-products';
  } else if (location.pathname.startsWith('/best-sellers')) {
    selectedKey = 'best-sellers';
  } else if (location.pathname.startsWith('/promotion-codes')) {
    selectedKey = 'promotion-codes';
  } else if (location.pathname.startsWith('/new-arrivals')) {
    selectedKey = 'new-arrivals';
  } else if (location.pathname.startsWith('/categories')) {
    selectedKey = 'categories';
  } else if (location.pathname.startsWith('/brands')) {
    selectedKey = 'brands';
  } else if (location.pathname.startsWith('/blog')) {
    selectedKey = 'blog';
  } else if (location.pathname.startsWith('/contact')) {
    selectedKey = 'contact';
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();

    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          const result = await NotificationService.getNotifications();
          const list: Notification[] = Array.isArray(result) ? result : (result?.data ?? []);
          setNotifications(list);
          setUnreadNotificationCount(list.filter((n) => !n.isRead).length);
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
    {
      key: 'wallet',
      label: (
        <Link to="/user/wallet" className="flex items-center">
          <CreditCardOutlined className="mr-2" />
          Ví Tonic Store
        </Link>
      )
    },
    {
      key: 'xu',
      label: (
        <Link to="/user/xu" className="flex items-center">
          <GiftOutlined className="mr-2" />
          Tonic Xu
        </Link>
      )
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className="flex items-center text-red-500" onClick={() => { logout(); navigate('/'); }}>
          <LogoutOutlined className="mr-2" />
          Đăng xuất
        </span>
      ),
    }
  ];

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        setIsSearching(true);
        const results = await ProductService.searchProducts(searchQuery.trim());
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { state: { results } });
        setIsMobileMenuOpen(false);
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
                src={item.product.imageUrl}
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
    <div className="bg-white sticky top-0 z-50 shadow-md">
      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <span className="text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-blue-600 transition-all duration-500">
              Tonic Store
            </span>
          </Link>

          {/* Search block - Visible on medium screens and up */}
          <div className="hidden md:flex flex-col flex-1 max-w-xl lg:max-w-2xl">
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
                  to={`/categories?category=${encodeURIComponent(cat.name)}`}
                  className="text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Icons visible on desktop */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">

              <Link to="/user/orders" className="flex items-center text-gray-600 hover:text-blue-500">
                <CarOutlined className="text-xl" />
                <span className="hidden md:inline ml-2">Theo dõi đơn hàng</span>
              </Link>

              <Popover content={notificationContent} trigger="hover" placement="bottomRight">
                <Link to="/notifications" className="flex items-center text-gray-600 hover:text-blue-500">
                  <Badge dot={unreadNotificationCount > 0}>
                    <BellOutlined className="text-xl" />
                  </Badge>
                  <span className="hidden md:inline ml-2">Thông báo</span>

                </Link>
              </Popover>

              <Link to="/wishlist" className="flex items-center text-gray-600 hover:text-blue-500">
                <Badge dot={wishlist.length > 0}>
                  <HeartOutlined className="text-xl" />
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

              {/* Auth */}
              {isAuthenticated && user ? (
                <Dropdown 
                  menu={{ items: userMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                  arrow={{ pointAtCenter: true }}
                >
                  <UserOutlined className="text-xl cursor-pointer" />
                </Dropdown>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="text-gray-600 hover:text-blue-500">Đăng nhập</Link>
                  <Link to="/register" className="text-gray-600 hover:text-blue-500">Đăng ký</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Button 
              className="md:hidden" 
              type="text" 
              icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
        
        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined className={`text-gray-400 ${isSearching ? 'animate-spin' : ''}`} />}
            className="w-full px-4 py-1.5 rounded-full border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            disabled={isSearching}
          />
        </div>
      </div>

      {/* Main navigation - Desktop */}
      <div className="container mx-auto px-4 border-b hidden md:block">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50">
           <div className="p-4 flex justify-between items-center border-b">
             <span className="font-bold text-lg">Menu</span>
             <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
           </div>
           <div className="p-4">
              <Menu mode="vertical" selectedKeys={[selectedKey]} className="border-none w-full">
                {menuItems.map((item) => (
                  <Menu.Item key={item.key} onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to={item.path}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
              <div className="border-t mt-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/user/profile" className="block p-2 hover:bg-gray-100 rounded">Hồ sơ</Link>
                    <Link to="/user/orders" className="block p-2 hover:bg-gray-100 rounded">Đơn hàng</Link>
                    <Link to="/notifications" className="block p-2 hover:bg-gray-100 rounded">Thông báo</Link>
                    <Link to="/wishlist" className="block p-2 hover:bg-gray-100 rounded">Yêu thích</Link>
                    <div
                      className="block p-2 text-red-500 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate('/');
                      }}
                    >
                      Đăng xuất
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block p-2 hover:bg-gray-100 rounded">Đăng nhập</Link>
                    <Link to="/register" className="block p-2 hover:bg-gray-100 rounded">Đăng ký</Link>
                  </>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
