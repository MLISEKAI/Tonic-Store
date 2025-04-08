import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Button, Layout, Badge, Input, Avatar, Dropdown, MenuProps } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'products',
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'categories',
      label: <Link to="/categories">Categories</Link>,
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'orders',
      label: <Link to="/orders">My Orders</Link>,
    },
    {
      key: 'wishlist',
      label: <Link to="/wishlist">Wishlist</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Tonic Store
            </Link>
            <div className="hidden md:block ml-10">
              <Menu
                mode="horizontal"
                items={menuItems}
                className="border-0"
                selectedKeys={[location.pathname.split('/')[1] || 'home']}
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              className="w-64"
            />
            <Badge count={5} size="small">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingCartOutlined className="text-xl" />
              </Link>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          </div>

          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 py-2">
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              className="w-full"
            />
          </div>
          <Menu
            mode="vertical"
            items={menuItems}
            className="border-0"
            selectedKeys={[location.pathname.split('/')[1] || 'home']}
          />
          <div className="flex items-center justify-between p-4 border-t">
            <Badge count={5} size="small">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingCartOutlined className="text-xl" />
              </Link>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          </div>
        </div>
      )}
    </Header>
  );
};

export default Navbar; 