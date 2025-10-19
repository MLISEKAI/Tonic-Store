import dotenv from "dotenv";
dotenv.config();

const config = {
  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    secretKey: process.env.VNPAY_SECRET_KEY || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/orders/vnpay/callback',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      maxAge: 24 * 60 * 60 * 1000,
    },
    refreshCookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    blacklistEnabled: process.env.JWT_BLACKLIST_ENABLED === 'true',
    blacklistTTL: parseInt(process.env.JWT_BLACKLIST_TTL || '86400'), // 1 day in seconds
  },
  database: {
     url: process.env.DATABASE_URL || 'mysql://root:root@db:3306/tonic_store',
  },
};

export default config;