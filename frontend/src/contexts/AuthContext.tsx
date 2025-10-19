import React, { createContext, useContext } from 'react';
import { UserService } from '../services/user/userService';
import { useAuthState } from '../hooks/useAuthState';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    setUser,
    setIsAuthenticated,
    checkAuth,
    clearAuth
  } = useAuthState();

  // Check auth status when component mounts
  React.useEffect(() => {
    // Với cookies, chỉ cần kiểm tra auth mà không cần lấy token từ localStorage
    checkAuth();
  }, [checkAuth]);

  // Không cần lưu user vào localStorage vì đã sử dụng cookies
  // Dữ liệu user sẽ được lấy trực tiếp từ API mỗi khi refresh trang

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await UserService.login(credentials);
      console.log('Login successful:', response);
      
      // Gọi checkAuth ngay sau khi đăng nhập thành công
      await checkAuth();
      
      // Đảm bảo trạng thái đã được cập nhật
      if (!isAuthenticated) {
        console.log('Forcing authentication state update');
        setIsAuthenticated(true);
        
        // Nếu không có user data, thử lấy lại từ API
        if (!user) {
          const userData = await UserService.getProfile();
          setUser(userData);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    try {
      const response = await UserService.register(data);
      return response;
    } catch (error) {
      console.error("Auth context register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await UserService.logout();
      clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
