import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../db/client';
import { cartItems, products } from '../db/schema';

const getCartItemsWithPrices = async () => {
  const rows = await drizzleDb.select().from(cartItems);
  const enriched = await Promise.all(
    rows.map(async (item) => {
      const [product] = await drizzleDb.select({ price: products.price, name: products.name, image: products.image }).from(products).where(eq(products.id, item.productId)).limit(1);
      return {
        ...item,
        price: Number(product?.price ?? 0),
        name: product?.name ?? '',
        image: product?.image ?? '',
      };
    }),
  );

  return enriched;
};

const calculateTotals = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 25 : 0;
  const tax = Math.round(subtotal * 0.08);
  const discount = 0;
  return {
    items,
    subtotal,
    shipping,
    discount,
    tax,
    total: subtotal + shipping + tax - discount,
    promoCode: null,
  };
};

export const getCart = async (_req: Request, res: Response) => {
  const items = await getCartItemsWithPrices();
  return res.json(calculateTotals(items));
};

export const addCartItem = async (req: Request, res: Response) => {
  await drizzleDb.insert(cartItems).values({
    userId: Number(req.body.userId ?? 0),
    productId: Number(req.body.productId),
    quantity: Number(req.body.quantity ?? 1),
    size: req.body.size ? String(req.body.size) : null,
    color: req.body.color ? String(req.body.color) : null,
  });

  const items = await getCartItemsWithPrices();
  return res.status(201).json(calculateTotals(items));
};

export const updateCartItem = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingItem] = await drizzleDb.select().from(cartItems).where(eq(cartItems.id, id)).limit(1);
  if (!existingItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  await drizzleDb.update(cartItems).set({
    quantity: Number(req.body.quantity ?? existingItem.quantity),
    size: req.body.size !== undefined ? String(req.body.size) : existingItem.size,
    color: req.body.color !== undefined ? String(req.body.color) : existingItem.color,
  }).where(eq(cartItems.id, id));

  const items = await getCartItemsWithPrices();
  return res.json(calculateTotals(items));
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingItem] = await drizzleDb.select().from(cartItems).where(eq(cartItems.id, id)).limit(1);
  if (!existingItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  await drizzleDb.delete(cartItems).where(eq(cartItems.id, id));
  const items = await getCartItemsWithPrices();
  return res.json(calculateTotals(items));
};

export const applyPromoCode = async (req: Request, res: Response) => {
  const promoCode = req.body.promoCode;
  if (!promoCode) {
    return res.status(400).json({ message: 'Promo code is required' });
  }

  const items = await getCartItemsWithPrices();
  const totals = calculateTotals(items);
  const discount = promoCode === 'SAVE10' ? Math.round(totals.subtotal * 0.1) : 0;
  return res.json({ ...totals, discount, total: totals.subtotal + totals.shipping + totals.tax - discount, promoCode });
};
