import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../db/client';
import { users } from '../db/schema';

const toUserResponse = (user: any) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const [user] = await drizzleDb.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    user: toUserResponse(user),
    addresses: [],
    paymentMethods: [],
    isAuthenticated: true,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = Number((req as any).user?.id);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const updateData: Record<string, string | number> = {};
  if (req.body.firstName) updateData.firstName = String(req.body.firstName);
  if (req.body.lastName) updateData.lastName = String(req.body.lastName);
  if (req.body.email) updateData.email = String(req.body.email);
  if (req.body.phone !== undefined) updateData.phone = String(req.body.phone);
  if (req.body.dateOfBirth !== undefined) updateData.dateOfBirth = String(req.body.dateOfBirth);
  if (req.body.language !== undefined) updateData.language = String(req.body.language);
  if (req.body.loyaltyTier !== undefined) updateData.loyaltyTier = String(req.body.loyaltyTier);
  if (req.body.loyaltyPoints !== undefined) updateData.loyaltyPoints = Number(req.body.loyaltyPoints);

  if (Object.keys(updateData).length > 0) {
    await drizzleDb.update(users).set(updateData).where(eq(users.id, userId));
  }

  const [updatedUser] = await drizzleDb.select().from(users).where(eq(users.id, userId)).limit(1);
  return res.json(toUserResponse(updatedUser));
};

export const listAddresses = (_req: Request, res: Response) => {
  return res.json([]);
};

export const addAddress = (req: Request, res: Response) => {
  return res.status(201).json({ ...req.body, id: Date.now() });
};

export const updateAddress = (req: Request, res: Response) => {
  return res.json({ ...req.body, id: Number(req.params.id) });
};

export const deleteAddress = (req: Request, res: Response) => {
  return res.json({ message: 'Address deleted' });
};

export const listPaymentMethods = (_req: Request, res: Response) => {
  return res.json([]);
};

export const addPaymentMethod = (req: Request, res: Response) => {
  return res.status(201).json({ ...req.body, id: Date.now() });
};

export const updatePaymentMethod = (req: Request, res: Response) => {
  return res.json({ ...req.body, id: Number(req.params.id) });
};

export const deletePaymentMethod = (req: Request, res: Response) => {
  return res.json({ message: 'Payment method deleted' });
};
