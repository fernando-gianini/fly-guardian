import type { Server } from 'http';
import app from './app.fg.js';
import { env } from './config/env.fg.js';
import { connectDB, disconnectDB } from './config/db.fg.js';
import { logger } from './utils/logger.fg.js';

let server: Server | undefined;
let shuttingDown = false;

async function main() {
  await connectDB();
  server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Server listening');
  });
}

main().catch(async (err) => {
  logger.error({ err }, 'Fatal on startup');
  await gracefulShutdown('startup-failure', err);
});

process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled rejection');
  void gracefulShutdown('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason)));
});

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
  void gracefulShutdown('uncaughtException', error);
});

async function gracefulShutdown(signal: string, error?: unknown) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (error) {
    logger.error({ signal, err: error }, 'Shutting down due to error');
  } else {
    logger.info({ signal }, 'Received shutdown signal');
  }

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close((closeErr) => {
        if (closeErr) {
          logger.error({ err: closeErr }, 'Error closing HTTP server');
        }
        resolve();
      });
    });
  }

  try {
    await disconnectDB();
  } catch (dbErr) {
    logger.error({ err: dbErr }, 'Error disconnecting MongoDB');
  }

  process.exit(error ? 1 : 0);
}
