import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({autoIncrement: true}),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  phone: text('phone').notNull().default(''),
  dateOfBirth: text('date_of_birth').notNull().default(''),
  language: text('language').notNull().default('English'),
  memberSince: text('member_since').notNull(),
  loyaltyTier: text('loyalty_tier').notNull().default('Bronze'),
  loyaltyPoints: integer('loyalty_points').notNull().default(0),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  image: text('image').notNull(),
  mainCategory: text('main_category').notNull(),
  subCategories: text('sub_categories').notNull(),
  description: text('description').notNull(),
  isNew: integer('is_new', {mode: 'boolean'}).notNull().default(false),
  isBestseller: integer('is_bestseller', {mode: 'boolean'}).notNull().default(false),
  rating: integer('rating').notNull().default(0),
  reviews: integer('reviews').notNull().default(0),
  colors: text('colors').notNull(),
  images: text('images').notNull(),
  inStock: integer('in_stock',{mode: 'boolean'}).notNull().default(true),
  stock: integer('stock').notNull().default(0),
  isFeatured: integer('is_featured', {mode: 'boolean'}).notNull().default(false),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({autoIncrement: true}),
  categoryId: text('category_id').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  productCount: integer('product_count').notNull().default(0),
  featured: integer('featured', {mode: 'boolean'}).notNull().default(false),
  subcategories: text('subcategories').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({autoIncrement: true}),
  orderId: text('order_id').notNull().unique(),
  userId: integer('user_id').notNull(),
  status: text('status').notNull(),
  total: integer('total').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  trackingNumber: text('tracking_number'),
  createdAt: text('created_at').notNull(),
});

export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  size: text('size'),
  color: text('color'),
});

export const wishlistItems = sqliteTable('wishlist_items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  addedAt: text('added_at').notNull(),
});

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: integer('id').primaryKey({autoIncrement: true}),
  email: text('email').notNull().unique(),
  subscribedAt: text('subscribed_at').notNull(),
});
