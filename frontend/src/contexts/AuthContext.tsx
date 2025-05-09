import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '../services/user/userService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra token và lấy thông tin user khi component mount
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const userData = await UserService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Nếu có lỗi, xóa token và reset state
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await UserService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token.trim());
        await checkAuth(); // Lấy thông tin user sau khi đăng nhập
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      await UserService.register(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
