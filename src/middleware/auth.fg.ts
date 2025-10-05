import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.fg.js';
import { UnauthorizedError } from '../utils/errors.fg.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return next(new UnauthorizedError());
  }

  const token = match[1]?.trim();
  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid token'));
  }
}
