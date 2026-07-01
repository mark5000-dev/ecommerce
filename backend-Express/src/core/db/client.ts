import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as tables from './schema'; // Import everything as an object

export const db = new Database('dev/dev.db');

export const drizzleDb = drizzle(db, { schema: tables });