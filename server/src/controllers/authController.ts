import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// @desc  Register new user
// @route POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getCurrentUser = (req: AuthRequest, res: Response) =>
  req.user ? res.status(200).json({ user: req.user }) : res.status(401).json({ error: 'Authentication is required' });
