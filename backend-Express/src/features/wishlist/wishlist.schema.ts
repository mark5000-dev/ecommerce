import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const wishlistItems = sqliteTable('wishlist_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    productId: integer('product_id').notNull(),
    addedAt: text('added_at').notNull(),
});