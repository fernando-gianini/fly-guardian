import jwt, { JwtPayload as LibJwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { env } from '../config/env.fg.js';
import { Role } from '../types/roles.fg.js';

export type JwtPayload = {
  sub: string;
  role: Role;
};

const baseSignOptions: SignOptions = { algorithm: 'RS256' };
const baseVerifyOptions: VerifyOptions = { algorithms: ['RS256'] };

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, JWT_EXPIRES_IN, REFRESH_EXPIRES_IN } = env;

export function signAccessToken(payload: JwtPayload): string {
  return signToken(payload, JWT_EXPIRES_IN);
}

export function signRefreshToken(payload: JwtPayload): string {
  return signToken(payload, REFRESH_EXPIRES_IN);
}

export function verifyAccessToken(token: string): JwtPayload {
  return verifyToken(token);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return verifyToken(token);
}

function signToken(payload: JwtPayload, expiresIn: string): string {
  const options: SignOptions = {
    ...baseSignOptions,
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_PRIVATE_KEY, options);
}

function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_PUBLIC_KEY, baseVerifyOptions);
  return ensurePayload(decoded);
}

function ensurePayload(decoded: string | LibJwtPayload): JwtPayload {
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  const { sub, role } = decoded as LibJwtPayload & JwtPayload;
  if (!sub || !role) {
    throw new Error('Token missing claims');
  }

  return { sub: String(sub), role: role as Role };
}
