import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../utils/jwt.js';

const buildAuthResponse = (user) => ({
  token: signToken({ id: user._id, role: user.role }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  },
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required');
  }

  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError('An account with that email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'customer',
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json(buildAuthResponse(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
