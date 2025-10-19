import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      try {
        const userData = await userService.getProfile();
        if (userData?.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
        }
      } catch (error) {
        window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
      } finally {
        setIsLoading(false);
      }
    };
    checkAdminAccess();
  }, []);

  if (isLoading) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;