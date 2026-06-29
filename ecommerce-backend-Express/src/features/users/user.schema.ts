import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
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