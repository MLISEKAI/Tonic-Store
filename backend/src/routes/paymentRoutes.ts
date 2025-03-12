import { FastifyInstance } from "fastify";
import { getAllPayments, createPayment, updatePaymentStatus } from "../services/paymentService";

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.get("/payments", async (_, reply) => {
    return reply.send(await getAllPayments());
  });

  fastify.post("/payments", async (request, reply) => {
    const { orderId, method, transactionId } = request.body as any;
    return reply.send(await createPayment(orderId, method, transactionId));
  });

  fastify.put("/payments/:orderId", async (request, reply) => {
    const { orderId } = request.params as any;
    const { status } = request.body as any;
    return reply.send(await updatePaymentStatus(Number(orderId), status));
  });
}
