import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mock-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string; firstName: string; lastName: string };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === 'string' || !payload || typeof payload !== 'object') {
      throw new Error('Invalid token payload');
    }

    req.user = {
      id: Number((payload as any).id),
      email: String((payload as any).email),
      firstName: String((payload as any).firstName),
      lastName: String((payload as any).lastName),
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const createToken = (user: { id: number; email: string; firstName: string; lastName: string }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
};
