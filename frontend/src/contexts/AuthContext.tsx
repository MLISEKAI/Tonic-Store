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
    checkAuth,
    clearAuth
  } = useAuthState();

  // Check auth status when component mounts
  React.useEffect(() => {
    // Với cookies, chỉ cần kiểm tra auth mà không cần lấy token từ localStorage
    checkAuth();
  }, [checkAuth]);

  // Lưu user vào localStorage mỗi khi user thay đổi
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await UserService.login(credentials);
      // Không cần lưu token vào localStorage vì đã được lưu trong HttpOnly cookies
      await checkAuth();
      return response;
    } catch (error) {
      clearAuth();
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
