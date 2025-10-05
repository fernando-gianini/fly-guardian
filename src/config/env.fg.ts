import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_PRIVATE_KEY: z.string().min(1, 'JWT_PRIVATE_KEY is required'),
  JWT_PUBLIC_KEY: z.string().min(1, 'JWT_PUBLIC_KEY is required'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const normalizeKey = (value: string) => value.replace(/\\n/g, '\n');

const rawOrigins = parsed.data.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = rawOrigins.includes('*') ? ['*'] : rawOrigins;

export const env = {
  ...parsed.data,
  JWT_PRIVATE_KEY: normalizeKey(parsed.data.JWT_PRIVATE_KEY),
  JWT_PUBLIC_KEY: normalizeKey(parsed.data.JWT_PUBLIC_KEY),
  CORS_ORIGINS: corsOrigins.length ? corsOrigins : ['http://localhost:3000'],
};

export type Env = typeof env;
