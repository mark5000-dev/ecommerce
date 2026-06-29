import fs from 'fs';
import path from 'path';
import { drizzleDb, db } from './core/db/client';
import { schema } from './core/db/schema';

const { users, products, categories, orders, cartItems, wishlistItems, newsletterSubscribers } = schema;


const dataDir = path.resolve('src', 'data');

const readJson = <T>(fileName: string): T => {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Mock data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
};

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      date_of_birth TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'English',
      member_since TEXT NOT NULL,
      loyalty_tier TEXT NOT NULL DEFAULT 'Bronze',
      loyalty_points INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      main_category TEXT NOT NULL,
      sub_categories TEXT NOT NULL,
      description TEXT NOT NULL,
      is_new INTEGER NOT NULL DEFAULT 0,
      is_bestseller INTEGER NOT NULL DEFAULT 0,
      rating INTEGER NOT NULL DEFAULT 0,
      reviews INTEGER NOT NULL DEFAULT 0,
      colors TEXT NOT NULL,
      images TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      stock INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      product_count INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      subcategories TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      total INTEGER NOT NULL,
      shipping_address TEXT NOT NULL,
      tracking_number TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      size TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      added_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TEXT NOT NULL
    );
  `);
};

const cleanTable = async (tableName: string) => {
  await db.exec(`DELETE FROM ${tableName};`);
};

const seed = async () => {
  const sampleProducts = readJson<any[]>('sample_data.json');
  const sampleCategories = readJson<any[]>('mock_categories.json');

  createTables();

  await cleanTable('wishlist_items');
  await cleanTable('cart_items');
  await cleanTable('orders');
  await cleanTable('products');
  await cleanTable('categories');
  await cleanTable('users');
  await cleanTable('newsletter_subscribers');


  await drizzleDb.insert(users).values([
    {
      firstName: 'Alexandra',
      lastName: 'Pierce',
      email: 'alex@example.com',
      passwordHash: 'password123',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-06-14',
      language: 'English',
      memberSince: '2023-10-02',
      loyaltyTier: 'Gold',
      loyaltyPoints: 50000,
    },
  ]);

  await drizzleDb.insert(categories).values(
    sampleCategories.map((category) => ({
      categoryId: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      productCount: category.productCount,
      featured: category.featured,
      subcategories: JSON.stringify(category.subcategories),
    })),
  );

  await drizzleDb.insert(products).values(
    sampleProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      mainCategory: product.mainCategory,
      subCategories: JSON.stringify(product.subCategories),
      description: product.description,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
      rating: Math.round(product.rating),
      reviews: product.reviews,
      colors: JSON.stringify(product.colors),
      images: JSON.stringify(product.images),
      inStock: product.inStock,
      stock: product.stock,
      isFeatured: product.isFeatured,
    })),
  );

  await drizzleDb.insert(cartItems).values([
    {
      userId: 1,
      productId: 1,
      quantity: 1,
      color: 'Red',
      size: 'M'
    },
    {
      userId: 1,
      productId: 2,
      quantity: 2,
      color: 'Blue',
      size: 'L'
    }
  ]);

  await drizzleDb.insert(wishlistItems).values([
    {
      userId: 1,
      productId: 1,
      addedAt: new Date().toISOString()
    },
    {
      userId: 1,
      productId: 2,
      addedAt: new Date().toISOString()
    }
  ]);

  await drizzleDb.insert(orders).values([
    {
      userId: 1,
      orderId: "ORD001",
      status: 'Delivered',
      total: 100,
      shippingAddress: '123 Main St',
      trackingNumber: '123456',
      createdAt: new Date().toISOString()
    },
    {
      userId: 1,
      orderId: "ORD002",
      status: 'Pending',
      total: 200,
      shippingAddress: '123 Main St',
      trackingNumber: '123456',
      createdAt: new Date().toISOString()
    }
  ])

  await drizzleDb.insert(newsletterSubscribers).values([
    {
      email: 'alex@example.com',
      subscribedAt: new Date().toISOString()
    },
    {
      email: "booking@domain.com",
      subscribedAt: new Date().toISOString()
    }
  ])


  console.log('Seed complete');
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
