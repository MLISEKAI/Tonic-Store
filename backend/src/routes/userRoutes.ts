import { FastifyInstance } from "fastify";
import { getAllUsers, createUser } from "../services/userService";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users", async (_, reply) => {
    return reply.send(await getAllUsers());
  });

  fastify.post("/users", async (request, reply) => {
    const { name, email, password, role } = request.body as any;
    return reply.send(await createUser(name, email, password, role));
  });
}
