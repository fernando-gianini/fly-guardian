import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.fg.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  resetSchema,
  RegisterInput,
  LoginInput,
  RefreshInput,
  ResetInput,
} from '../schemas/auth.schema.fg.js';
import {
  createUser,
  findUserByEmail,
  validatePassword,
  toPublicUser,
  UserDocument,
} from '../services/user.service.fg.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from '../utils/jwt.fg.js';
import { Role } from '../types/roles.fg.js';

type RefreshStoreValue = {
  userId: string;
  role: Role;
};

const refreshTokenStore = new Map<string, RefreshStoreValue>();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = registerSchema.parse(req.body) as RegisterInput;

    const existing = await findUserByEmail(payload.email);
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const user = await createUser(payload);
    const tokens = issueTokens(user);

    res.status(201).json({
      user: toPublicUser(user),
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = loginSchema.parse(req.body) as LoginInput;

    const user = await findUserByEmail(payload.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValid = await validatePassword(user, payload.password);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const tokens = issueTokens(user);

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body) as RefreshInput;

    const stored = refreshTokenStore.get(refreshToken);
    if (!stored) {
      throw new AppError(401, 'Invalid refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      refreshTokenStore.delete(refreshToken);
      throw new AppError(401, 'Invalid refresh token');
    }

    if (stored.userId !== payload.sub) {
      refreshTokenStore.delete(refreshToken);
      throw new AppError(401, 'Invalid refresh token');
    }

    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = resetSchema.parse(req.body) as ResetInput;

    // Mock behaviour: do nothing besides returning a message.
    void payload;

    res.json({ message: 'Reset link sent (mock)' });
  } catch (error) {
    next(error);
  }
}

function issueTokens(user: UserDocument) {
  const payload: JwtPayload = {
    sub: user.id,
    role: user.role as Role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  refreshTokenStore.set(refreshToken, { userId: payload.sub, role: payload.role });

  return { accessToken, refreshToken };
}
