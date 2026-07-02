import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { orders, orderItems } from './order.schema';

/**
 * 1. Fetch all orders with their line items
 */
export const listOrders = async (req: Request, res: Response) => {
  try {
    // Read the user ID assigned by your authenticateJWT middleware
    // Fallback to req.body.userId only if your auth middleware populates there
    const userId = (req as any).user?.id || Number(req.body.userId || 0);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const rows = await drizzleDb
      .select()
      .from(orders)
      .where(eq(orders.userId, userId)) // 👈 This filters the records by the active user!
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId));

    const ordersMap = new Map<number, any>();

    for (const row of rows) {
      if (!ordersMap.has(row.orders.id)) {
        ordersMap.set(row.orders.id, {
          ...row.orders,
          items: []
        });
      }
      if (row.order_items) {
        ordersMap.get(row.orders.id).items.push(row.order_items);
      }
    }

    return res.json({ orders: Array.from(ordersMap.values()) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve orders' });
  }
};

/**
 * 2. Get a single order with its items by ID or custom Order ID string
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Explicitly fallback or cast to string to enforce Drizzle type compliance
    const safeId = String(id || ''); 
    const isNumericId = !isNaN(Number(safeId)) && safeId.trim() !== '';

    // Fixes Error 1: Ensures safeId is an absolute string value
    const condition = isNumericId ? eq(orders.id, Number(safeId)) : eq(orders.orderId, safeId);

    const rows = await drizzleDb
      .select()
      .from(orders)
      .where(condition)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId));

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure rows[0] exists before attempting to access its properties
    const firstRow = rows[0];
    if (!firstRow) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Now TypeScript knows with 100% certainty that firstRow is defined
    const resultOrder = {
      ...firstRow.orders,
      items: rows.map(row => row.order_items).filter(Boolean)
    };

    return res.json(resultOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

/**
 * 3. Atomic creation of Order & associated items (using a Transaction)
 */
export const createOrder = async (req: Request, res: Response) => {
  const { userId, total, shippingAddress, trackingNumber, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'An order must contain at least one item.' });
  }

  const generatedOrderId = `ORD-${Date.now()}`;

  try {
    const finalOrder = await drizzleDb.transaction(async (tx) => {
      const insertedRows = await tx
        .insert(orders)
        .values({
          orderId: generatedOrderId,
          userId: Number(userId ?? 0),
          status: 'Processing',
          total: Number(total ?? 0),
          shippingAddress: String(shippingAddress || ''),
          trackingNumber: trackingNumber ? String(trackingNumber) : null,
          createdAt: new Date().toISOString(),
        })
        .returning();

      const newOrder = insertedRows[0];
      
      // Fixes Error 2: Guard check ensures TypeScript knows newOrder is defined
      if (!newOrder) {
        throw new Error('Database failed to return the created order.');
      }

      const itemsPayload = items.map((item: any) => ({
        orderId: newOrder.id, // Safe now!
        productId: Number(item.productId),
        quantity: Number(item.quantity ?? 1),
        priceAtPurchase: Number(item.priceAtPurchase),
        color: item.color ? String(item.color) : null,
        size: item.size ? String(item.size) : null,
      }));

      const insertedItems = await tx.insert(orderItems).values(itemsPayload).returning();

      return {
        ...newOrder,
        items: insertedItems
      };
    });

    return res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Order Transaction Failed:", error);
    return res.status(500).json({ message: 'Failed to complete order submission.' });
  }
};

/**
 * 4. Cancel active order standard lifecycle routing
 */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const [updatedOrder] = await drizzleDb
      .update(orders)
      .set({ status: 'Cancelled' })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
};