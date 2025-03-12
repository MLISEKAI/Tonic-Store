import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load biến môi trường từ `.env`
dotenv.config();

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Kích hoạt CORS
fastify.register(cors);

// ------------------- API Users -------------------
// Lấy danh sách user
fastify.get("/users", async (_, reply) => {
  const users = await prisma.user.findMany();
  return reply.send(users);
});

// Tạo user mới
fastify.post("/users", async (request, reply) => {
  const { name, email, password, role } = request.body as any;
  try {
    const user = await prisma.user.create({
      data: { name, email, password, role },
    });
    return reply.send(user);
  } catch (error) {
    return reply.status(500).send({ error: "Lỗi khi tạo user" });
  }
});

// ------------------- API Products -------------------
// Lấy danh sách sản phẩm
fastify.get("/products", async (_, reply) => {
  const products = await prisma.product.findMany();
  return reply.send(products);
});

// Tạo sản phẩm mới
fastify.post("/products", async (request, reply) => {
  const { name, description, price, stock, imageUrl, category } = request.body as any;
  try {
    const product = await prisma.product.create({
      data: { name, description, price, stock, imageUrl, category },
    });
    return reply.send(product);
  } catch (error) {
    return reply.status(500).send({ error: "Lỗi khi tạo sản phẩm" });
  }
});

// ------------------- API Orders -------------------
// Lấy danh sách đơn hàng
fastify.get("/orders", async (_, reply) => {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true, payment: true },
  });
  return reply.send(orders);
});

// Tạo đơn hàng mới
fastify.post("/orders", async (request, reply) => {
  const { userId, totalPrice, status, items } = request.body as any;
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ error: "Lỗi khi tạo đơn hàng" });
  }
});

// ------------------- Khởi động server -------------------
const PORT = process.env.PORT || 5000;

fastify.listen({ port: Number(PORT), host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
