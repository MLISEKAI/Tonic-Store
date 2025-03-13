import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Tonic Store
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-indigo-600">
              Sản phẩm
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
                  Giỏ hàng
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-indigo-600">
                  Đơn hàng
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Xin chào, {user?.name}</span>
                  <button
                    onClick={() => logout()}
                    className="text-red-600 hover:text-red-800"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
