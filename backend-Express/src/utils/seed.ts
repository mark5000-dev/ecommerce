import fs from 'fs';
import path from 'path';
import { drizzleDb } from '../core/db/client';
import * as schema from '../core/db/schema';

// Deconstruct the named exports from your schema object
const { users, products, categories, orders, cartItems, wishlistItems, newsletterSubscribers } = schema;

const dataDir = path.resolve('src', 'data');

const readJson = <T>(fileName: string): T => {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Mock data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
};

// Clean table natively via drizzleDb
const cleanTable = async (table: any) => {
  await drizzleDb.delete(table);
};

const seed = async () => {
  console.log('⏳ Cleaning existing tables...');
  const sampleProducts = readJson<any[]>('sample_data.json');
  const sampleCategories = readJson<any[]>('mock_categories.json');

  // Truncate tables cleanly using Drizzle ORM references
  await cleanTable(wishlistItems);
  await cleanTable(cartItems);
  await cleanTable(orders);
  await cleanTable(products);
  await cleanTable(categories);
  await cleanTable(users);
  await cleanTable(newsletterSubscribers);

  console.log('🌱 Seeding new data...');

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
      // If your Drizzle schema expects text/string for SQLite JSON fields, leave this stringify.
      // If your Drizzle schema uses .json() datatype, pass the raw array/object directly.
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
      // Pass actual booleans instead of 1 or 0
      isNew: !!product.isNew,
      isBestseller: !!product.isBestseller,
      rating: Math.round(product.rating),
      reviews: product.reviews,
      colors: JSON.stringify(product.colors),
      images: JSON.stringify(product.images),
      inStock: !!product.inStock,
      stock: product.stock,
      isFeatured: !!product.isFeatured,
    })),
  );

  await drizzleDb.insert(cartItems).values([
    { userId: 1, productId: 1, quantity: 1, color: 'Red', size: 'M' },
    { userId: 1, productId: 2, quantity: 2, color: 'Blue', size: 'L' }
  ]);

  await drizzleDb.insert(wishlistItems).values([
    { userId: 1, productId: 1, addedAt: new Date().toISOString() },
    { userId: 1, productId: 2, addedAt: new Date().toISOString() }
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
  ]);

  await drizzleDb.insert(newsletterSubscribers).values([
    { email: 'alex@example.com', subscribedAt: new Date().toISOString() },
    { email: "booking@domain.com", subscribedAt: new Date().toISOString() }
  ]);

  console.log('✅ Seed complete');
};

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});