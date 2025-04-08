import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeProvider from '../../providers/ThemeProvider';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <ThemeProvider>
      <Layout className="min-h-screen">
        <Navbar />
        <Content className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </ThemeProvider>
  );
};

export default MainLayout; 