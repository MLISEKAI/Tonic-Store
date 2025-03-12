import { FastifyInstance } from "fastify";
import { getAllProducts, createProduct } from "../services/productService";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/products", async (_, reply) => {
    return reply.send(await getAllProducts());
  });

  fastify.post("/products", async (request, reply) => {
    const { name, description, price, stock, imageUrl, category } = request.body as any;
    return reply.send(await createProduct(name, description, price, stock, imageUrl, category));
  });
}
