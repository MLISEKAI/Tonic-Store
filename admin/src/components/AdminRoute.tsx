import React, { useEffect } from 'react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Lưu token/role nếu có trên URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    
    if (token) {
      localStorage.setItem('token', token);
    }
    if (role) {
      localStorage.setItem('user', JSON.stringify({ role }));
    }
    
    if (token || role) {
      // Xóa token/role khỏi URL và reload lại để đảm bảo localStorage đã có
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
      return;
    }
  }, []);

  // Kiểm tra quyền như cũ
  const localToken = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!localToken || user.role !== 'ADMIN') {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;