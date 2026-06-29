import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { users, products, categories, orders, cartItems, wishlistItems, newsletterSubscribers } from './schema';

export const db = new Database('src/db/dev.db');
export const drizzleDb = drizzle(db, { schema: { users, products, categories, orders, cartItems, wishlistItems, newsletterSubscribers } });
