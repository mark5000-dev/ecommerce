import { type CartItem } from './cart';

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
  itemCount: number;
  shippingAddress?: string;
  trackingNumber?: string;
  image?: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}
