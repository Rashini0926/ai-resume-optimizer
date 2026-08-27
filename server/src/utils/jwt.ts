import jwt, { type SignOptions } from 'jsonwebtoken';
export interface TokenPayload { id: string; }
const secret = () => { if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured'); return process.env.JWT_SECRET; };
export const generateToken = (id: string) => jwt.sign(
  { id },
  secret(),
  { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'] }
);
export const verifyToken = (token: string) => jwt.verify(token, secret()) as TokenPayload;
