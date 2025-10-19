import express, { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { register } from 'prom-client';
import { swaggerSpec } from './config/swagger';
import logger from './config/logger';
import * as metrics from './config/metrics';

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import statsRoutes from "./routes/statsRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import reviewRoutes from './routes/reviewRoutes';
import shippingAddressRoutes from "./routes/shippingAddressRoutes";
import shipperRoutes from './routes/shipperRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import notificationRoutes from "./routes/notificationRoutes";
import discountCodeRoutes from './routes/discountCodeRoutes';
import helpCenterRoutes from './routes/helpCenterRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(helmet());

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
app.use(compression() as unknown as RequestHandler);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 1000 // limit each IP to 1000 requests per windowMs
// });
// app.use(limiter);

// Metrics middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    metrics.httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      duration
    );
    metrics.httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// API Documentation
app.use('/api/docs', 
  swaggerUi.serve as unknown as RequestHandler, 
  swaggerUi.setup(swaggerSpec) as unknown as RequestHandler
);

// Metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).end();
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware để xử lý request
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Test endpoint
app.get('/test', (req: Request, res: Response) => {
    console.log('Test endpoint hit');
    res.json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        headers: req.headers
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shipping-addresses', shippingAddressRoutes);
app.use('/api/shippers', shipperRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/discount-codes', discountCodeRoutes);
app.use('/api/help-center', helpCenterRoutes);


// Middleware để bắt lỗi
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    if (err instanceof Error) {
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

const PORT = Number(process.env.PORT) || 8085;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server chạy tại http://${HOST}:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL:', process.env.DATABASE_URL);
    console.log(`API documentation available at http://localhost:${PORT}/api/docs`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});

// Xử lý lỗi server
server.on('error', (error: Error) => {
    console.error('Server error:', error);
});

server.on('listening', () => {
    console.log('Server is listening on port:', PORT);
});
