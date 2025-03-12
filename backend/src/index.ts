import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

// Load biến môi trường từ `.env`
dotenv.config();

const fastify = Fastify({ logger: true });

// Kích hoạt CORS
fastify.register(cors);

// Đăng ký routes
fastify.register(userRoutes);


// Khởi động server
const PORT = process.env.PORT || 5000;
fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
