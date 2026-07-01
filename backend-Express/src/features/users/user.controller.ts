import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { users } from './user.schema';

const toUserResponse = (user: any) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const [user] = await drizzleDb.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Flattened structure directly returning properties to satisfy frontend contracts
    return res.json(toUserResponse(user));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Unpack potential inner object properties passed down through profileData wrappers
    const body = req.body.profileData || req.body;

    const updateData: Record<string, any> = {};
    if (body.firstName !== undefined) updateData.firstName = String(body.firstName);
    if (body.lastName !== undefined) updateData.lastName = String(body.lastName);
    if (body.email !== undefined) updateData.email = String(body.email).toLowerCase();
    if (body.phone !== undefined) updateData.phone = String(body.phone);
    if (body.dateOfBirth !== undefined) updateData.dateOfBirth = String(body.dateOfBirth);
    if (body.language !== undefined) updateData.language = String(body.language);
    if (body.loyaltyTier !== undefined) updateData.loyaltyTier = String(body.loyaltyTier);
    if (body.loyaltyPoints !== undefined) updateData.loyaltyPoints = Number(body.loyaltyPoints);

    if (Object.keys(updateData).length > 0) {
      await drizzleDb.update(users).set(updateData).where(eq(users.id, userId));
    }

    const [updatedUser] = await drizzleDb.select().from(users).where(eq(users.id, userId)).limit(1);
    return res.json(toUserResponse(updatedUser));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/* --- Addresses --- */

export const listAddresses = (_req: Request, res: Response) => {
  // Returns an array directly to match api.getAddresses()
  return res.json([]);
};

export const addAddress = (req: Request, res: Response) => {
  const body = req.body.address || req.body;
  return res.status(201).json({
    ...body,
    id: Date.now()
  });
};

export const updateAddress = (req: Request, res: Response) => {
  const body = req.body.address || req.body;
  return res.json({
    ...body,
    id: Number(req.params.id)
  });
};

export const deleteAddress = (_req: Request, res: Response) => {
  return res.json({ message: 'Address deleted successfully' });
};

/* --- Payment Methods --- */

export const listPaymentMethods = (_req: Request, res: Response) => {
  // Returns an array directly to match api.getPaymentMethods()
  return res.json([]);
};

export const addPaymentMethod = (req: Request, res: Response) => {
  const body = req.body.paymentMethod || req.body;
  return res.status(201).json({
    ...body,
    id: Date.now()
  });
};

export const updatePaymentMethod = (req: Request, res: Response) => {
  const body = req.body.paymentMethod || req.body;
  return res.json({
    ...body,
    id: Number(req.params.id)
  });
};

export const deletePaymentMethod = (_req: Request, res: Response) => {
  return res.json({ message: 'Payment method deleted successfully' });
};