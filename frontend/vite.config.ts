import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        style-src 'self' 'unsafe-inline' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        img-src 'self' data: blob: https://* http://* https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        font-src 'self' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        connect-src 'self' http://localhost:8085 http://localhost:3001 https://sandbox.vnpayment.vn https://*.vnpayment.vn ws://localhost:* http://172.18.0.3:8085;
        frame-src 'self' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        form-action 'self' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        media-src 'self' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
        object-src 'self' https://sandbox.vnpayment.vn https://*.vnpayment.vn;
      `.replace(/\s+/g, ' ').trim()
    }
  },
})
