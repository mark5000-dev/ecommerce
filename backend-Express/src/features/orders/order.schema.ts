import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from '../users/user.schema'; // Adjust paths as necessary
import { products } from '../products/product.schema';

// 1. The Parent Order Table (High level data)
export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: text('order_id').notNull().unique(), // e.g., "ORD001"
    userId: integer('user_id').notNull().references(() => users.id),
    status: text('status').notNull(),
    total: integer('total').notNull(), // Total price in cents/smallest unit
    shippingAddress: text('shipping_address').notNull(),
    trackingNumber: text('tracking_number'),
    createdAt: text('created_at').notNull(),
});

// 2. The Child Order Items Table (The actual products bought)
export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // Links back to the main order row
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }), 
    // Links to the product that was purchased
    productId: integer('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull().default(1),
    // Crucial: Snapshot the price at the exact moment of purchase! 
    // (In case you change the product price in the store later)
    priceAtPurchase: integer('price_at_purchase').notNull(), 
    color: text('color'),
    size: text('size'),
});