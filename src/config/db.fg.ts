import mongoose from 'mongoose';
import { env } from './env.fg.js';
import { logger } from '../utils/logger.fg.js';

mongoose.set('strictQuery', true);

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
  } catch (err) {
    logger.error({ err }, 'Failed to establish MongoDB connection');
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
