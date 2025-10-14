import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Lưu role nếu có trên URL (token sẽ được lưu trong cookie)
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    
    if (role) {
      localStorage.setItem('user', JSON.stringify({ role }));
      // Xóa role khỏi URL và reload lại
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
      return;
    }

    // Kiểm tra quyền bằng cách gọi API
    const checkAdminAccess = async () => {
      try {
        const userData = await userService.getUserById(1);
        if (userData && userData.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
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