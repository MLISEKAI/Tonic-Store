import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const app = express();
const morgan = require('morgan');

// Cấu hình CORS chi tiết
const corsOptions = {
    origin: 'http://localhost:5173', // Only allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Middleware để xử lý request
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(cors(corsOptions));

// Xử lý preflight requests
app.options('*', cors(corsOptions));

// Cấu hình body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan('dev'));

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

// Middleware để bắt lỗi
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

const PORT = Number(process.env.PORT) || 8085;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL:', process.env.DATABASE_URL);
});

// Xử lý lỗi server
server.on('error', (error: any) => {
    console.error('Server error:', error);
});

server.on('listening', () => {
    console.log('Server is listening on port:', PORT);
});
