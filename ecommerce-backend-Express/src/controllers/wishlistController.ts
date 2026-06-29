import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../db/client';
import { wishlistItems } from '../db/schema';

export const getWishlist = async (_req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(wishlistItems);
  return res.json({ items: rows });
};

export const addWishlistItem = async (req: Request, res: Response) => {
  await drizzleDb.insert(wishlistItems).values({
    userId: Number(req.body.userId ?? 0),
    productId: Number(req.body.productId),
    addedAt: new Date().toISOString(),
  });

  const rows = await drizzleDb.select().from(wishlistItems);
  return res.status(201).json(rows[rows.length - 1]);
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  const [existingItem] = await drizzleDb.select().from(wishlistItems).where(eq(wishlistItems.productId, productId)).limit(1);
  if (!existingItem) {
    return res.status(404).json({ message: 'Wishlist item not found' });
  }

  await drizzleDb.delete(wishlistItems).where(eq(wishlistItems.productId, productId));
  return res.json({ message: 'Wishlist item removed' });
};
