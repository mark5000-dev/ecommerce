export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
}
