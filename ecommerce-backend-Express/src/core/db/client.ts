import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { schema } from './schema';

export const db = new Database('dev.db');
export const drizzleDb = drizzle(db, { schema });
