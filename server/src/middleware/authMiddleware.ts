import { NextFunction, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from './auth';
import { verifyToken } from '../utils/jwt';
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const value = req.headers.authorization;
    if (!value?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication token is required' });
    const { id } = verifyToken(value.slice(7));
    const user = await User.findById(id).select('_id name email').lean();
    if (!user) return res.status(401).json({ error: 'User account no longer exists' });
    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    return next();
  } catch { return res.status(401).json({ error: 'Invalid or expired authentication token' }); }
};
