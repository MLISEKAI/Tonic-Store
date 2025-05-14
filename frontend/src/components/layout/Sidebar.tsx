import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ShoppingOutlined,
  MobileOutlined,
  UserOutlined,
  LaptopOutlined,
  HomeOutlined,
  CameraOutlined,
  HeartOutlined,
  SkinOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  BookOutlined,
  GiftOutlined,
  ToolOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

const Sidebar: React.FC = () => {
  const allCategories = [
    {
      key: "men-fashion",
      icon: <SkinOutlined />,
      label: "Thời Trang Nam"
    },
    {
      key: "women-fashion",
      icon: <SkinOutlined />,
      label: "Thời Trang Nữ"
    },
    {
      key: "phone-accessories",
      icon: <MobileOutlined />,
      label: "Điện Thoại & Phụ Kiện"
    },
    {
      key: "mother-baby",
      icon: <UserOutlined />,
      label: "Mẹ & Bé"
    },
    {
      key: "electronics",
      icon: <AppstoreOutlined />,
      label: "Thiết Bị Điện Tử"
    },
    {
      key: "home-life",
      icon: <HomeOutlined />,
      label: "Nhà Cửa & Đời Sống"
    },
    {
      key: "laptop",
      icon: <LaptopOutlined />,
      label: "Máy Tính & Laptop"
    },
    {
      key: "beauty",
      icon: <HeartOutlined />,
      label: "Sắc Đẹp"
    },
    {
      key: "camera",
      icon: <CameraOutlined />,
      label: "Máy Ảnh & Máy Quay Phim"
    },
    {
      key: "health",
      icon: <PlusCircleOutlined />,
      label: "Sức Khỏe"
    },
    {
      key: "watches",
      icon: <ClockCircleOutlined />,
      label: "Đồng Hồ"
    },
    {
      key: "women-shoes",
      icon: <ShoppingOutlined />,
      label: "Giày Dép Nữ"
    },
    {
      key: "men-shoes",
      icon: <ShoppingOutlined />,
      label: "Giày Dép Nam"
    },
    {
      key: "women-bags",
      icon: <ShoppingCartOutlined />,
      label: "Túi Ví Nữ"
    },
    {
      key: "home-appliances",
      icon: <ToolOutlined />,
      label: "Thiết Bị Điện Gia Dụng"
    },
    {
      key: "accessories",
      icon: <GiftOutlined />,
      label: "Phụ Kiện & Trang Sức Nữ"
    },
    {
      key: "sports",
      icon: <ShoppingOutlined />,
      label: "Thể Thao & Du Lịch"
    },
    {
      key: "grocery",
      icon: <ShoppingCartOutlined />,
      label: "Bách Hóa Online"
    },
    {
      key: "vehicles",
      icon: <CarOutlined />,
      label: "Ô Tô & Xe Máy & Xe Đạp"
    },
    {
      key: "books",
      icon: <BookOutlined />,
      label: "Nhà Sách Online"
    },
    {
      key: "men-bags",
      icon: <ShoppingCartOutlined />,
      label: "Balo & Túi Ví Nam"
    },
    {
      key: "kids-fashion",
      icon: <SkinOutlined />,
      label: "Thời Trang Trẻ Em"
    },
    {
      key: "toys",
      icon: <GiftOutlined />,
      label: "Đồ Chơi"
    },
    {
      key: "home-care",
      icon: <HomeOutlined />,
      label: "Giặt Giũ & Chăm Sóc Nhà Cửa"
    },
    {
      key: "pet-care",
      icon: <HeartOutlined />,
      label: "Chăm Sóc Thú Cưng"
    },
    {
      key: "vouchers",
      icon: <GiftOutlined />,
      label: "Voucher & Dịch Vụ"
    },
    {
      key: "tools",
      icon: <ToolOutlined />,
      label: "Dụng cụ và thiết bị tiện ích"
    }
  ];

  return (
    <div className="fixed w-[240px]">
      <div
        className="rounded-lg max-h-[calc(100vh-200px)] overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        <div className='font-semibold px-6 py-2'>
          Danh mục
        </div>
        <Menu
          mode="inline"
          className="border-0"
          style={{ width: '100%' }}
        >
          {allCategories.map((category) => (
            <Menu.Item
              key={category.key}
              icon={category.icon}
              className="hover:bg-gray-50 !py-2"
            >
              <Link to={`/categories?category=${encodeURIComponent(category.label)}`} className="text-gray-700 hover:text-[#D70018]">
                {category.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;