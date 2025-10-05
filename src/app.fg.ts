import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.fg.js';
import routes from './bootstrap/routes.auth.bootstrap.fg.js';
import { errorHandler } from './middleware/errorHandler.fg.js';
import { NotFoundError } from './utils/errors.fg.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const allowAllOrigins = env.CORS_ORIGINS.includes('*');
app.use(
  cors({
    origin: allowAllOrigins ? true : env.CORS_ORIGINS,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health',
  })
);

app.use(routes);

app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
