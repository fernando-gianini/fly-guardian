import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.fg.js';
import { AppError, isAppError } from '../utils/errors.fg.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isAppError(err)) {
    const payload = buildPayload(err);
    if (err.statusCode >= 500) {
      logger.error({ err }, 'Application error');
    } else {
      logger.warn({ err }, 'Request error');
    }
    return res.status(err.statusCode).json(payload);
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues }, 'Validation error');
    return res.status(400).json({
      message: 'Validation error',
      issues: err.issues,
    });
  }

  const status = (err as any)?.status || (err as any)?.statusCode || 500;
  logger.error({ err }, 'Unhandled error');
  return res.status(status >= 400 ? status : 500).json({ message: 'Internal Server Error' });
}

function buildPayload(error: AppError) {
  const base = { message: error.message } as { message: string; details?: unknown };
  if (error.expose && error.details !== undefined) {
    base.details = error.details;
  }
  return base;
}
