import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Menu,
  Badge,
  Dropdown,
  Avatar
} from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTheme } from '../../providers/ThemeProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'products', label: 'Products', path: '/products' },
    { key: 'categories', label: 'Categories', path: '/categories' },
    { key: 'about', label: 'About', path: '/about' },
    { key: 'contact', label: 'Contact', path: '/contact' }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="/profile" className="flex items-center">
          <UserOutlined className="mr-2" />
          Profile
        </Link>
      )
    },
    {
      key: 'orders',
      label: (
        <Link to="/orders" className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          My Orders
        </Link>
      )
    },
    {
      key: 'wishlist',
      label: (
        <Link to="/wishlist" className="flex items-center">
          <HeartOutlined className="mr-2" />
          Wishlist
        </Link>
      )
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className="flex items-center text-red-500">
          <LogoutOutlined className="mr-2" />
          Logout
        </span>
      ),
      danger: true
    }
  ];

  const selectedKey = location.pathname.split('/')[1] || 'home';

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-800 shadow-md rounded-b-xl'
          : 'bg-transparent'
      }`}
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
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              className="border-0 bg-transparent flex flex-wrap gap-4"
            >
              {menuItems.map((item) => (
                <Menu.Item key={item.key} className="!px-4">
                  <Link
                    to={item.path}
                    className={`text-gray-600 font-semibold hover:text-blue-600 transition-colors${
                      selectedKey === item.key ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-64 px-4 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="text"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                icon={<HeartOutlined className="text-xl" />}
              />
              <Badge count={5} size="small" offset={[-2, 2]}>
                <Button
                  type="text"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                  icon={<ShoppingCartOutlined className="text-xl" />}
                />
              </Badge>
              <Button
                type="text"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                icon={
                  theme === 'dark' ? (
                    <SunOutlined className="text-xl" />
                  ) : (
                    <MoonOutlined className="text-xl" />
                  )
                }
                onClick={toggleTheme}
              />
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="text"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:shadow-md transition-all"
                >
                  <Avatar
                    icon={<UserOutlined />}
                    className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  />
                </Button>
              </Dropdown>
            </div>
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 transform origin-top ${
            isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
        >
          <div className="py-4">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full px-4 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
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
                  className={`text-gray-600 font-semibold hover:text-blue-600 transition-colors${
                    selectedKey === item.key
                      ? 'text-blue-600'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
