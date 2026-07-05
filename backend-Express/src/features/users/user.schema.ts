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

export const addresses = sqliteTable('addresses',{
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type : text('type').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zip: text('zip').notNull(),
    country: text('country').notNull(),
    phone: text('phone').notNull().default(''),
    isDefault: integer('is_default').notNull().default(0),
})

export const paymentMethods = sqliteTable('payment_methods', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    last4: text('last4').notNull(),
    expiry: text('expiry').notNull(),
    isDefault: integer('is_default').notNull().default(0),
}
)