import type { Request, Response } from 'express';
import { eq, and, isNull } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { cartItems } from './cart.schema';
import { products } from '../products/product.schema';


const getCartItemsWithPrices = async (userId: number) => {
  const rows = await drizzleDb
    .select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      size: cartItems.size,
      color: cartItems.color,
      name: products.name,
      price: products.price,
      image: products.image,
    })
    .from(cartItems)
    .where(eq(cartItems.userId, userId)) 
    .leftJoin(products, eq(cartItems.productId, products.id));

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    productId: row.productId,
    quantity: row.quantity,
    size: row.size,
    color: row.color,
    price: Number(row.price ?? 0),
    name: row.name ?? '',
    image: row.image ?? '',
  }));
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


export const getCart = async (req: Request, res: Response) => {
  // Grab user id cleanly set from your authenticateJWT middleware context
  const userId = (req as any).user?.id;
  console.log(userId);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const items = await getCartItemsWithPrices(Number(userId));
  return res.json(calculateTotals(items));
};



// ... inside addCartItem ...
export const addCartItem = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity ?? 1);
  const size = req.body.size ? String(req.body.size) : null;
  const color = req.body.color ? String(req.body.color) : null;

  // Build out strict matching conditions for dynamic SQLite column states
  const sizeCondition = size ? eq(cartItems.size, size) : isNull(cartItems.size);
  const colorCondition = color ? eq(cartItems.color, color) : isNull(cartItems.color);

  // Check if item already exists with matching text properties or exact NULL states
  const [existingItem] = await drizzleDb
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        sizeCondition,  // Uses correct equal vs isNull logic
        colorCondition  // Uses correct equal vs isNull logic
      )
    )
    .limit(1);

  if (existingItem) {
    await drizzleDb
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await drizzleDb.insert(cartItems).values({
      userId,
      productId,
      quantity,
      size,
      color,
    });
  }

  const items = await getCartItemsWithPrices(userId);
  return res.status(201).json(calculateTotals(items));
};

/**
 * 3. Update Item Quantity/Attributes
 */
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const id = Number(req.params.id);

  // Security Verification: Ensure the cart row item belongs to the user editing it!
  const [existingItem] = await drizzleDb
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)))
    .limit(1);

  if (!existingItem) {
    return res.status(404).json({ message: 'Cart item not found or unauthorized access' });
  }

  await drizzleDb
    .update(cartItems)
    .set({
      quantity: Number(req.body.quantity ?? existingItem.quantity),
      size: req.body.size !== undefined ? String(req.body.size) : existingItem.size,
      color: req.body.color !== undefined ? String(req.body.color) : existingItem.color,
    })
    .where(eq(cartItems.id, id));

  const items = await getCartItemsWithPrices(userId);
  return res.json(calculateTotals(items));
};

/**
 * 4. Delete Item from Cart
 */
export const deleteCartItem = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const id = Number(req.params.id);

  // Security Verification: Ensure the item belongs to the logged in user
  const [existingItem] = await drizzleDb
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)))
    .limit(1);

  if (!existingItem) {
    return res.status(404).json({ message: 'Cart item not found or unauthorized access' });
  }

  await drizzleDb.delete(cartItems).where(eq(cartItems.id, id));
  
  const items = await getCartItemsWithPrices(userId);
  return res.json(calculateTotals(items));
};

/**
 * 5. Apply Promo Code Calculations
 */
export const applyPromoCode = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const promoCode = req.body.promoCode;
  if (!promoCode) {
    return res.status(400).json({ message: 'Promo code is required' });
  }

  const items = await getCartItemsWithPrices(userId);
  const totals = calculateTotals(items);
  const discount = promoCode === 'SAVE10' ? Math.round(totals.subtotal * 0.1) : 0;
  
  return res.json({ 
    ...totals, 
    discount, 
    total: totals.subtotal + totals.shipping + totals.tax - discount, 
    promoCode 
  });
};