import { FastifyInstance } from "fastify";
import { registerUser } from "../services/auth/registerService";
import { loginUser } from "../services/auth/loginService";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    try {
      const { name, email, password } = request.body as any;
      const user = await registerUser(name, email, password);
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: "Lỗi khi đăng ký" });
    }
  });

  fastify.post("/login", async (request, reply) => {
    try {
      const { email, password } = request.body as any;
      const { token, user } = await loginUser(email, password);
      reply.send({ token, user });
    } catch (error) {
      reply.status(401).send({ error: "Sai email hoặc mật khẩu" });
    }
  });
}
