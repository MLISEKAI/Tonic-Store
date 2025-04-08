import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 6,
          },
          Card: {
            borderRadius: 12,
          },
          Input: {
            borderRadius: 6,
          },
          Select: {
            borderRadius: 6,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider; 