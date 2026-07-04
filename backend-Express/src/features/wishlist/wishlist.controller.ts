import type { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { wishlistItems } from './wishlist.schema';


export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await drizzleDb
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, Number(userId)));

    return res.json({ items: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve wishlist items' });
  }
};

export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const productId = Number(req.body.productId);

    // Check if the item is already present in this specific user's wishlist
    const [existingItem] = await drizzleDb
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, Number(userId)),
          eq(wishlistItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem) {
      return res.status(200).json(existingItem); // Return existing entry if already liked
    }

    // Insert new item safely linked to the user context
    const [newItem] = await drizzleDb
      .insert(wishlistItems)
      .values({
        userId: Number(userId),
        productId,
        addedAt: new Date().toISOString(),
      })
      .returning();

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add item to wishlist' });
  }
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const productId = Number(req.params.productId);

    // CRITICAL SECURITY FIX: Scope lookup to both the productId AND the requesting userId
    const [existingItem] = await drizzleDb
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.productId, productId),
          eq(wishlistItems.userId, Number(userId))
        )
      )
      .limit(1);

    if (!existingItem) {
      return res.status(404).json({ message: 'Wishlist item not found or unauthorized' });
    }

    // Safely delete only the user's row
    await drizzleDb
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.productId, productId),
          eq(wishlistItems.userId, Number(userId))
        )
      );

    return res.json({ message: 'Wishlist item removed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to remove wishlist item' });
  }
};