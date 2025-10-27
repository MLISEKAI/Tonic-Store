import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(new URL('./src', import.meta.url).pathname),
    },
  },
  optimizeDeps: {
    include: ['antd', '@ant-design/icons'],
  },
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://server-be:8085',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.vnpayment.vn;
        style-src 'self' 'unsafe-inline' https://sandbox.vnpayment.vn;
        img-src 'self' data: blob: https://sandbox.vnpayment.vn;
        font-src 'self';
        connect-src 'self' http://localhost:8085 https://sandbox.vnpayment.vn;
        frame-src 'self' https://sandbox.vnpayment.vn;
        form-action 'self' https://sandbox.vnpayment.vn;
      `.replace(/\s+/g, ' ').trim()
    }
  },
}) 