import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { newsletterSubscribers } from './newsletter.schema';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const [existingSubscriber] = await drizzleDb.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, String(email))).limit(1);
  if (!existingSubscriber) {
    await drizzleDb.insert(newsletterSubscribers).values({
      email: String(email),
      subscribedAt: new Date().toISOString(),
    });
  }

  return res.status(201).json({ message: 'Subscribed successfully', email });
};
