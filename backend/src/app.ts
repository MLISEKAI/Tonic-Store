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

const app = express();

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3001',
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

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


export default app;