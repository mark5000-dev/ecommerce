import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    image: text('image').notNull(),
    mainCategory: text('main_category').notNull(),
    subCategories: text('sub_categories').notNull(),
    description: text('description').notNull(),
    isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
    isBestseller: integer('is_bestseller', { mode: 'boolean' }).notNull().default(false),
    rating: integer('rating').notNull().default(0),
    reviews: integer('reviews').notNull().default(0),
    colors: text('colors').notNull(),
    images: text('images').notNull(),
    inStock: integer('in_stock', { mode: 'boolean' }).notNull().default(true),
    stock: integer('stock').notNull().default(0),
    isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
});