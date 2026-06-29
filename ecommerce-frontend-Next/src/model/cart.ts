export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  category: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  promoCode?: string;
}
