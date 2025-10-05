process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.PORT = process.env.PORT ?? '0';
process.env.MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/flyguardian_test';
process.env.JWT_PRIVATE_KEY =
  process.env.JWT_PRIVATE_KEY ?? '-----BEGIN PRIVATE KEY-----\nFAKEKEY\n-----END PRIVATE KEY-----';
process.env.JWT_PUBLIC_KEY =
  process.env.JWT_PUBLIC_KEY ?? '-----BEGIN PUBLIC KEY-----\nFAKEKEY\n-----END PUBLIC KEY-----';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '15m';
process.env.REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? '7d';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
