import pino from 'pino';
import { env } from '../config/env.fg.js';

const isProd = env.NODE_ENV === 'production';

export const logger = pino({
  level: isProd ? 'info' : 'debug',
  messageKey: 'message',
  base: { service: 'flyguardian-api', env: env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      },
});
