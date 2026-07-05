import type { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { users, addresses, paymentMethods } from './user.schema';

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

export const listAddresses = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await drizzleDb.select().from(addresses).where(eq(addresses.userId, userId));
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const body = req.body.address || req.body;

    const [newAddress] = await drizzleDb.insert(addresses).values({
      userId,
      type: String(body.type || 'Home'),
      address: String(body.address || ''),
      city: String(body.city || ''),
      state: String(body.state || ''),
      zip: String(body.zip || ''),
      country: String(body.country || ''),
      phone: String(body.phone || ''),
      isDefault: body.isDefault ? 1 : 0, // Maps JS Boolean to SQLite Integer
    }).returning();

    return res.status(201).json(newAddress);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const addressId = Number(req.params.id);
    const body = req.body.address || req.body;

    // Secure Verification Check: Ensure target row belongs to active user
    const [existing] = await drizzleDb.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
    if (!existing) return res.status(404).json({ message: 'Address record not found' });

    const [updatedAddress] = await drizzleDb.update(addresses).set({
      type: body.type !== undefined ? String(body.type) : existing.type,
      address: body.address !== undefined ? String(body.address) : existing.address,
      city: body.city !== undefined ? String(body.city) : existing.city,
      state: body.state !== undefined ? String(body.state) : existing.state,
      zip: body.zip !== undefined ? String(body.zip) : existing.zip,
      country: body.country !== undefined ? String(body.country) : existing.country,
      phone: body.phone !== undefined ? String(body.phone) : existing.phone,
      isDefault: body.isDefault !== undefined ? (body.isDefault ? 1 : 0) : existing.isDefault,
    }).where(eq(addresses.id, addressId)).returning();

    return res.json(updatedAddress);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const addressId = Number(req.params.id);

    const [existing] = await drizzleDb.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
    if (!existing) return res.status(404).json({ message: 'Address record not found' });

    await drizzleDb.delete(addresses).where(eq(addresses.id, addressId));
    return res.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* --- Payment Methods --- */

export const listPaymentMethods = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await drizzleDb.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const addPaymentMethod = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const body = req.body.paymentMethod || req.body;

    const [newMethod] = await drizzleDb.insert(paymentMethods).values({
      userId,
      type: String(body.type || 'Visa'),
      last4: String(body.last4 || '0000'),
      expiry: String(body.expiry || ''),
      isDefault: body.isDefault ? 1 : 0,
    }).returning();

    return res.status(201).json(newMethod);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const methodId = Number(req.params.id);
    const body = req.body.paymentMethod || req.body;

    const [existing] = await drizzleDb.select().from(paymentMethods).where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId))).limit(1);
    if (!existing) return res.status(404).json({ message: 'Payment method not found' });

    const [updatedMethod] = await drizzleDb.update(paymentMethods).set({
      type: body.type !== undefined ? String(body.type) : existing.type,
      last4: body.last4 !== undefined ? String(body.last4) : existing.last4,
      expiry: body.expiry !== undefined ? String(body.expiry) : existing.expiry,
      isDefault: body.isDefault !== undefined ? (body.isDefault ? 1 : 0) : existing.isDefault,
    }).where(eq(paymentMethods.id, methodId)).returning();

    return res.json(updatedMethod);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const methodId = Number(req.params.id);

    const [existing] = await drizzleDb.select().from(paymentMethods).where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId))).limit(1);
    if (!existing) return res.status(404).json({ message: 'Payment method not found' });

    await drizzleDb.delete(paymentMethods).where(eq(paymentMethods.id, methodId));
    return res.json({ message: 'Payment method deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};