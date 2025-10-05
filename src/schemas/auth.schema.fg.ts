import { z } from 'zod';
import { Roles } from '../types/roles.fg.js';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name too long'),
  email: z.string().email('Invalid email address').max(320),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.nativeEnum(Roles),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token is required'),
});

export const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
