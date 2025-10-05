import argon2 from 'argon2';
import { HydratedDocument } from 'mongoose';
import { User, IUser } from '../models/User.fg.js';
import { Roles } from '../types/roles.fg.js';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Roles;
  tenantId?: string;
}

export type UserDocument = HydratedDocument<IUser>;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Roles;
  tenantId?: string;
}

export async function createUser(data: CreateUserInput): Promise<UserDocument> {
  const passwordHash = await argon2.hash(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    tenantId: data.tenantId,
  });
  return user;
}

export function findUserByEmail(email: string): Promise<UserDocument | null> {
  return User.findOne({ email }).exec();
}

export async function validatePassword(user: IUser, password: string): Promise<boolean> {
  return argon2.verify(user.passwordHash, password);
}

export function toPublicUser(user: IUser | UserDocument): PublicUser {
  const plain = typeof user.toJSON === 'function' ? (user.toJSON() as any) : user;
  return {
    id: plain.id ?? plain._id?.toString?.() ?? String(plain._id),
    name: plain.name,
    email: plain.email,
    role: plain.role,
    tenantId: plain.tenantId ?? undefined,
  };
}
