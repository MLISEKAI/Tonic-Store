export interface IWishlistRepository {
  getUserWishlist(userId: number): Promise<any[]>;
  addToWishlist(userId: number, productId: number): Promise<any>;
  removeFromWishlist(userId: number, productId: number): Promise<any>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
} 