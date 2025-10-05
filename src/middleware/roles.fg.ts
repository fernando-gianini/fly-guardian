import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.fg.js';
import { Role } from '../types/roles.fg.js';

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return next(new UnauthorizedError());
    if (!roles.includes(role)) return next(new ForbiddenError());
    return next();
  };
}
