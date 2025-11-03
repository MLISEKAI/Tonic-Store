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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile.role !== 'ADMIN') {
          setUser(null);
          return;
        }
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
    if (result.role !== 'ADMIN') {
      throw new Error('Bạn không có quyền truy cập vào trang quản trị');
    }
    setUser(result);
    console.log(result);
    return result;
  };

  const logout = async () => {
    await userService.logout();
    setUser(null);
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
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
