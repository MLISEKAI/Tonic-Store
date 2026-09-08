import { useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

const AdminRouter = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

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
