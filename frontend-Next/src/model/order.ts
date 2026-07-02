export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  color: string | null;
  size: string | null;
}

export interface Order {
  id: number;          // DB Primary Key auto-increment integer
  orderId: string;     // Unique string representation e.g. "ORD-172000..."
  userId: number;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  createdAt: string;   // Maps to the DB ISO text timestamp
  shippingAddress: string;
  trackingNumber: string | null;
  items: OrderItem[];  // Relational sub-array mapping directly to the child table
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}