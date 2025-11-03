import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

const AdminRouter = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Chỉ redirect khi đã check xong (loading = false) và không có user hoặc không phải ADMIN
    if (!loading && (!user || user.role !== 'ADMIN')) {
      // Redirect sang frontend URL login page
      window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#fff'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  
  // Nếu chưa có user hoặc không phải ADMIN, không render children (sẽ redirect trong useEffect)
  if (!user || user.role !== 'ADMIN') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#fff'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return children;
};

export default AdminRouter;
