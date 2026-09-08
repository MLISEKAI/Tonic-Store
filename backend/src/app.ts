import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';
import categoryRoutes from "./routes/categoryRoutes";
import shippingAddressRoutes from './routes/shippingAddressRoutes';
import discountCodeRoutes from './routes/discountCodeRoutes';
import shipperRoutes from './routes/shipperRoutes';
import helpCenterRoutes from './routes/helpCenterRoutes';
import walletRoutes from './routes/walletRoutes';
import paymentGatewayRoutes from './routes/paymentGatewayRoutes';
import withdrawalRoutes from './routes/withdrawalRoutes';
import topUpPackageRoutes from './routes/topUpPackageRoutes';
import logRoutes from './routes/logRoutes';
import notificationRoutes from './routes/notificationRoutes';
import reviewRoutes from './routes/reviewRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import { attachApiResponseHelpers } from './common/types/api-response';
import logger from './config/logger';

const app = express();

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
];

const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean) as string[];

const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use(attachApiResponseHelpers);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/discount-codes', discountCodeRoutes);
app.use('/api/shippers', shipperRoutes);
app.use('/api/help-center', helpCenterRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment-gateway', paymentGatewayRoutes);
app.use('/api/withdrawal', withdrawalRoutes);
app.use('/api/topup-packages', topUpPackageRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

export default app;
