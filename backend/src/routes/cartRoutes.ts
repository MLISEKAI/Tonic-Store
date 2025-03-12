import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import { getCartByUserId, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from "../services/cartService";

export default async function cartRoutes(fastify: FastifyInstance) {
  // Lấy giỏ hàng của user
  fastify.get("/cart/:userId",  { preHandler: authenticate }, async (request, reply) => {
    const { userId } = request.params as any;
    try {
      const cart = await getCartByUserId(Number(userId));
      return reply.send(cart);
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi khi lấy giỏ hàng" });
    }
  });

  // Thêm sản phẩm vào giỏ hàng
  fastify.post("/cart",  { preHandler: authenticate }, async (request, reply) => {
    const { userId, productId, quantity } = request.body as any;
    try {
      const cartItem = await addToCart(Number(userId), Number(productId), Number(quantity));
      return reply.send(cartItem);
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi khi thêm vào giỏ hàng" });
    }
  });

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  fastify.put("/cart",  { preHandler: authenticate }, async (request, reply) => {
    const { userId, productId, quantity } = request.body as any;
    try {
      await updateCartItemQuantity(Number(userId), Number(productId), Number(quantity));
      return reply.send({ message: "Cập nhật số lượng sản phẩm thành công" });
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi khi cập nhật giỏ hàng" });
    }
  });

  // Xóa sản phẩm khỏi giỏ hàng
  fastify.delete("/cart",  { preHandler: authenticate }, async (request, reply) => {
    const { userId, productId } = request.body as any;
    try {
      await removeFromCart(Number(userId), Number(productId));
      return reply.send({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" });
    }
  });

  // Xóa toàn bộ giỏ hàng
  fastify.delete("/cart/clear",  { preHandler: authenticate }, async (request, reply) => {
    const { userId } = request.body as any;
    try {
      await clearCart(Number(userId));
      return reply.send({ message: "Xóa toàn bộ giỏ hàng thành công" });
    } catch (error) {
      return reply.status(500).send({ error: "Lỗi khi xóa toàn bộ giỏ hàng" });
    }
  });
}
