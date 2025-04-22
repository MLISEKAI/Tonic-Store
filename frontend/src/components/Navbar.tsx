import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Menu,
  Badge,
  Dropdown,
  Avatar,
  notification
} from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { isAuthenticated, token, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: 'home', label: 'Trang chủ', path: '/' },
    { key: 'products', label: 'Sản phẩm', path: '/products' },
    { key: 'categories', label: 'Danh mục', path: '/categories' },
    { key: 'about', label: 'Giới thiệu', path: '/about' },
    { key: 'contact', label: 'Liên hệ', path: '/contact' }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="/profile" className="flex items-center">
          <UserOutlined className="mr-2" />
          Hồ sơ
        </Link>
      )
    },
    {
      key: 'orders',
      label: (
        <Link to="/orders" className="flex items-center">
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
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className="flex items-center text-red-500" onClick={() => logout()}>
          <LogoutOutlined className="mr-2" />
          Đăng xuất
        </span>
      ),
      danger: true
    }
  ];

  const selectedKey = location.pathname.split('/')[1] || 'home';

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        setIsSearching(true);
        const results = await api.searchProducts(searchQuery.trim());
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { state: { results } });
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi xảy ra khi tìm kiếm sản phẩm',
          placement: 'topRight',
        });
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 bg-white shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full overflow-visible">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-blue-600 transition-all duration-500">
              Tonic Store
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 whitespace-nowrap overflow-visible">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-gray-600 text-lg font-semibold hover:text-blue-600 transition-colors ${
                  selectedKey === item.key ? 'text-blue-600' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined className={`text-gray-400 ${isSearching ? 'animate-spin' : ''}`} />}
                className="w-64 px-4 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                disabled={isSearching}
              />
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to="/wishlist">
                    <Button
                      type="text"
                      className="hover:bg-gray-100 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                      icon={<HeartOutlined className="text-xl" />}
                    />
                  </Link>
                  <Link to="/cart">
                    <Badge count={totalItems} size="small" offset={[-2, 2]}>
                      <Button
                        type="text"
                        className="hover:bg-gray-100 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                        icon={<ShoppingCartOutlined className="text-xl" />}
                      />
                    </Badge>
                  </Link>
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Button
                      type="text"
                      className="hover:bg-gray-100 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-blue-100 text-blue-600"
                      />
                    </Button>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button type="primary" className="mr-2">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>Đăng ký</Button>
                  </Link>
                </>
              )}
            </div>
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              className="md:hidden hover:bg-gray-100 rounded-full p-2 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 transform origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
            }`}
        >
          <div className="py-4">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className={`text-gray-400 ${isSearching ? 'animate-spin' : ''}`} />}
              className="w-full px-4 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              disabled={isSearching}
            />
          </div>
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            className="border-0 bg-transparent"
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} className="!px-4">
                <Link
                  to={item.path}
                  className={`text-gray-600 font-semibold hover:text-blue-600 transition-colors${selectedKey === item.key
                      ? 'text-blue-600'
                      : ''
                    }`}
                >
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
            {!isAuthenticated && (
              <>
                <Menu.Item key="login" className="!px-4">
                  <Link
                    to="/login"
                    className="text-gray-600 font-semibold hover:text-blue-600 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </Menu.Item>
                <Menu.Item key="register" className="!px-4">
                  <Link
                    to="/register"
                    className="text-gray-600 font-semibold hover:text-blue-600 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
