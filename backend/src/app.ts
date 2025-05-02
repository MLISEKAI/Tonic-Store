import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';
import categoryRoutes from "./routes/categoryRoutes";
import shippingAddressRoutes from './routes/shippingAddressRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);

export default app; 