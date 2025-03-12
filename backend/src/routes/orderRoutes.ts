import { FastifyInstance } from "fastify";
import { getAllOrders, createOrder } from "../services/orderService";

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.get("/orders", async (_, reply) => {
    return reply.send(await getAllOrders());
  });

  fastify.post("/orders", async (request, reply) => {
    const { userId, totalPrice, status, items } = request.body as any;
    return reply.send(await createOrder(userId, totalPrice, status, items));
  });
}
