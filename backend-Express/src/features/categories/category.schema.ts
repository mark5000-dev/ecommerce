import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    categoryId: text('category_id').notNull().unique(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    image: text('image').notNull(),
    description: text('description').notNull(),
    productCount: integer('product_count').notNull().default(0),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    subcategories: text('subcategories').notNull(),
});