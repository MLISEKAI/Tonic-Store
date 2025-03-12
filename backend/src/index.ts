import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";

// Load biến môi trường từ `.env`
dotenv.config();

const fastify = Fastify({ logger: true });

// Kích hoạt CORS
fastify.register(cors);

// Đăng ký routes
fastify.register(userRoutes);
fastify.register(productRoutes);
fastify.register(cartRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
