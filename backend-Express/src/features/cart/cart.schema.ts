import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const cartItems = sqliteTable('cart_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    productId: integer('product_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
    size: text('size'),
    color: text('color'),
});