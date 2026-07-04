import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { users } from '../users/user.schema';
import { createToken } from '../../core/middlewares/auth';

export const register = async (req: Request, res: Response) => {
  try {
    // Unpacks { userData: { firstName, lastName, ... } } to support frontend register contract
    const body = req.body.userData || req.body;
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emailStr = String(email).toLowerCase();

    const [existingUser] = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, emailStr))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Insert new user
    await drizzleDb.insert(users).values({
      firstName: String(firstName),
      lastName: String(lastName),
      email: emailStr,
      passwordHash: String(password), // Note: Replace with bcrypt/argon2 hashing in production!
      phone: '',
      dateOfBirth: '',
      language: 'English',
      memberSince: new Date().toISOString().split('T')[0] ?? '',
      loyaltyTier: 'Bronze',
      loyaltyPoints: 0,
    });

    const [newUser] = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, emailStr))
      .limit(1);

    if (!newUser) {
      return res.status(500).json({ message: 'Unable to create user' });
    }

    const { passwordHash, ...safeUser } = newUser;

    // Returns token directly at root object to satisfy frontend localStorage setter
    return res.status(201).json({
      message: 'User registered successfully',
      user: safeUser,
      token: createToken({ id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName }),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailStr = String(email).toLowerCase();

    const [user] = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, emailStr))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Direct password match (Sync with your chosen hashing algorithm later)
    if (user.passwordHash !== String(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { passwordHash, ...safeUser } = user;

    return res.json({
      message: 'Login successful',
      user: safeUser,
      token: createToken({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [user] = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.id, Number(authUser.id)))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...safeUser } = user;

    // The frontend's useUser expects the safeUser properties at the payload root
    return res.json(safeUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};


//implement logout functionality
export const logout = (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};