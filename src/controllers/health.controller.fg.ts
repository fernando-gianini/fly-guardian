import { Request, Response } from 'express';
import { env } from '../config/env.fg.js';

export function getHealth(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
}
