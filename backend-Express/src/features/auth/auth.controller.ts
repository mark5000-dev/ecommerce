import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { users } from '../users/user.schema';
import { createToken } from '../../core/middlewares/auth';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const [existingUser] = await drizzleDb.select().from(users).where(eq(users.email, String(email))).limit(1);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  await drizzleDb.insert(users).values({
    firstName: String(firstName),
    lastName: String(lastName),
    email: String(email),
    passwordHash: String(password),
    phone: '',
    dateOfBirth: '',
    language: 'English',
    memberSince: new Date().toISOString().split('T')[0] ?? '',
    loyaltyTier: 'Bronze',
    loyaltyPoints: 0,
  });

  const [newUser] = await drizzleDb.select().from(users).where(eq(users.email, String(email))).limit(1);
  if (!newUser) {
    return res.status(500).json({ message: 'Unable to create user' });
  }

  const { passwordHash, ...safeUser } = newUser;

  return res.status(201).json({
    message: 'User registered successfully',
    user: safeUser,
    token: createToken({ id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName }),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const [user] = await drizzleDb.select().from(users).where(eq(users.email, String(email))).limit(1);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;

  return res.json({
    message: 'Login successful',
    user: safeUser,
    token: createToken({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }),
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  return res.json({ user: (req as any).user });
};

export const logout = (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};
