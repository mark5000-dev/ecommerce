import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: text('order_id').notNull().unique(),
    userId: integer('user_id').notNull(),
    status: text('status').notNull(),
    total: integer('total').notNull(),
    shippingAddress: text('shipping_address').notNull(),
    trackingNumber: text('tracking_number'),
    createdAt: text('created_at').notNull(),
});