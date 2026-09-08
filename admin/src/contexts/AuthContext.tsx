import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '../services/userService';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = localStorage.getItem('admin_user');
        if (stored) {
          const profile = JSON.parse(stored);
          if (profile.role === 'ADMIN') {
            setUser(profile);
            return;
          }
        }

        const profile = await userService.getProfile();
        if (profile.role !== 'ADMIN') {
          setUser(null);
          return;
        }
        localStorage.setItem('admin_user', JSON.stringify(profile));
        setUser(profile);
      } catch (error) {
        setUser(null);
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await userService.login(email, password);
    const userData = result.user || result;
    if (userData.role !== 'ADMIN') {
      throw new Error('Bạn không có quyền truy cập vào trang quản trị');
    }
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    return userData;
  };

  const refreshUser = async () => {
    try {
      const profile = await userService.getProfile();
      if (profile.role === 'ADMIN') {
        setUser(profile);
        localStorage.setItem('admin_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('admin_user');
      }
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }
    setUser(null);
    localStorage.removeItem('admin_user');
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
