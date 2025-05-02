export const config = {
  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    secretKey: process.env.VNPAY_SECRET_KEY || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/user/orders/vnpay/callback',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/tonic_store',
  },
}; 