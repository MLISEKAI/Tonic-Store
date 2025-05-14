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
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const userData = await UserService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
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