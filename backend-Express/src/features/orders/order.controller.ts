import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { orders } from './order.schema';

export const listOrders = async (_req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(orders);
  return res.json({ orders: rows });
};

export const getOrderById = async (req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(orders);
  const order = rows.find((item) => item.id === Number(req.params.id) || item.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const orderId = `ORD-${Date.now()}`;
  await drizzleDb.insert(orders).values({
    orderId,
    userId: Number(req.body.userId ?? 0),
    status: 'Processing',
    total: Number(req.body.total ?? 0),
    shippingAddress: String(req.body.shippingAddress || ''),
    trackingNumber: req.body.trackingNumber ? String(req.body.trackingNumber) : null,
    createdAt: new Date().toISOString(),
  });

  const [createdOrder] = await drizzleDb.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
  return res.status(201).json(createdOrder);
};

export const cancelOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingOrder] = await drizzleDb.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!existingOrder) {
    return res.status(404).json({ message: 'Order not found' });
  }

  await drizzleDb.update(orders).set({ status: 'Cancelled' }).where(eq(orders.id, id));
  const [updatedOrder] = await drizzleDb.select().from(orders).where(eq(orders.id, id)).limit(1);
  return res.json(updatedOrder);
};
