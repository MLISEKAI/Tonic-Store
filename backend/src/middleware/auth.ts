import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Không có token");

    const decoded = jwt.verify(token, SECRET_KEY);

    // Lưu thông tin user vào request bằng `request.request.set()`
    (request as any).set("user", decoded);
    
  } catch (error) {
    reply.status(401).send({ error: "Bạn chưa đăng nhập" });
  }
};