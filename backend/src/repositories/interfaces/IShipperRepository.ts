export interface IShipperRepository {
  getAllShippers(): Promise<any[]>;
  assignShipperToOrder(orderId: number, shipperId: number): Promise<any>;
  createDeliveryLog(orderId: number, shipperId: number, status: any, note?: string): Promise<any>;
  updateOrderStatus(orderId: number, status: any): Promise<any>;
  getShipperOrders(shipperId: number, status?: any): Promise<any[]>;
  getOrderDeliveryLogs(orderId: number): Promise<any[]>;
  findOrderById(orderId: number): Promise<any>;
  findDeliveryRating(orderId: number): Promise<any>;
  createDeliveryRating(orderId: number, userId: number, rating: number, comment?: string): Promise<any>;
  getShipperById(id: number): Promise<any>;
} 