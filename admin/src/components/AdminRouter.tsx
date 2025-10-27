import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

const AdminRouter = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

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
  
  if (!user || user.role !== 'ADMIN')
    return <Navigate to="/login" replace />;

  return children;
};

export default AdminRouter;
