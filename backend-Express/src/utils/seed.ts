import fs from 'fs';
import path from 'path';
import { drizzleDb } from '../core/db/client';
import * as schema from '../core/db/schema';

// Deconstruct the named exports from your schema object
const { users, products, categories, orders, orderItems, cartItems, wishlistItems, newsletterSubscribers, addresses, paymentMethods } = schema;

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

  // CRITICAL FIX: Delete child references (orderItems) BEFORE clearing parent records (orders)
  // to avoid Foreign Key constraint crashes.
  await cleanTable(orderItems);
  await cleanTable(wishlistItems);
  await cleanTable(cartItems);
  await cleanTable(orders);
  await cleanTable(products);
  await cleanTable(categories);
  await cleanTable(users);
  await cleanTable(newsletterSubscribers);
  await cleanTable(addresses);
  await cleanTable(paymentMethods);

  console.log('🌱 Seeding new data...');

  console.log('Seeding users...');
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

  console.log('Adding addresses...');
  await drizzleDb.insert(addresses).values([
    {
      userId: 1,
      type: 'Home',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'USA',
      phone: '+1 (555) 123-4567',
      isDefault: 1,
    },
    {
        userId: 1,
        type: 'office',
        address: '456 Park Avenue, Suite 2000',
        city: 'New York',
        state: 'NY',
        zip: '10022',
        country: 'USA',
        phone: '+1 (555) 987-6543',
        isDefault: 0,
    },
  ]);

  console.log('Adding payment methods...');
  await drizzleDb.insert(paymentMethods).values([
    {
      userId: 1,
      type: 'Credit Card',
      last4: '1234',
      expiry: '12/25',
      isDefault: 1,
    },
    {
      userId: 1,
      type: 'PayPal',
      last4: '5678',
      expiry: 'N/A',
      isDefault: 0,
    },
  ]);


  console.log('Seeding categories...');
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
  console.log('seeding products...');
  await drizzleDb.insert(products).values(
    sampleProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      mainCategory: product.mainCategory,
      subCategories: JSON.stringify(product.subCategories),
      description: product.description,
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

  console.log('inserting cartitems...');
  await drizzleDb.insert(cartItems).values([
    { userId: 1, productId: 31, quantity: 1, color: 'Red', size: 'M' },
    { userId: 1, productId: 5, quantity: 2, color: 'Blue', size: 'L' }
  ]);

  console.log('inserting wishlist items...');
  await drizzleDb.insert(wishlistItems).values([
    { userId: 1, productId: 7, addedAt: new Date().toISOString() },
    { userId: 1, productId: 28, addedAt: new Date().toISOString() }
  ]);

  console.log('adding orders and order items...'); 
  const insertedOrders = await drizzleDb.insert(orders).values([
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
  ]).returning({ id: orders.id, orderId: orders.orderId });

  const dbOrder001 = insertedOrders.find(o => o.orderId === "ORD001");
  const dbOrder002 = insertedOrders.find(o => o.orderId === "ORD002");

  if (!dbOrder001 || !dbOrder002) {
    throw new Error("Could not retrieve inserted order references for items seeding.");
  }

  // Insert child items mapping directly into the newly generated parent IDs
  await drizzleDb.insert(orderItems).values([
    {
      orderId: dbOrder001.id, 
      productId: 1,
      quantity: 1,
      priceAtPurchase: 40,
      color: 'Red',
      size: 'M'
    },
    {
      orderId: dbOrder001.id,
      productId: 2,
      quantity: 2,
      priceAtPurchase: 30, 
      color: 'Blue',
      size: 'L'
    },
    {
      orderId: dbOrder002.id, 
      productId: 1,
      quantity: 4,
      priceAtPurchase: 50, 
      color: 'Black',
      size: 'XL'
    }
  ]);

  console.log('adding newsletter subscribers...');
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