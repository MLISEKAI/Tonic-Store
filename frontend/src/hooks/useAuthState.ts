import { useState, useCallback } from 'react';
import { UserService } from '../services/user/userService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Custom hook to manage authentication state
 * @returns Object containing auth state and functions to manage it
 */
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API để lấy thông tin user từ cookies
      const userData = await UserService.getProfile();
      
      // Chỉ set isAuthenticated = true khi có dữ liệu user hợp lệ
      if (userData && userData.id) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User authenticated:', userData);
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    // Không cần xóa token từ localStorage vì đã sử dụng cookies
    // Cookies sẽ được xóa bởi server khi logout
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    setUser,
    setIsAuthenticated,
    checkAuth,
    clearAuth
  };
}