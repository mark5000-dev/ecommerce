import { sqliteTable } from "drizzle-orm/sqlite-core";
import { integer, text } from "drizzle-orm/sqlite-core";


export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    subscribedAt: text('subscribed_at').notNull(),
});