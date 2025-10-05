import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from '../src/routes/auth.routes.fg.js';
import { errorHandler } from '../src/middleware/errorHandler.fg.js';

describe('Auth routes', () => {
  let app: express.Express;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'flyguardian-auth-test' });

    app = express();
    app.use(express.json());
    app.use(authRoutes);
    app.use(errorHandler);
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('executa fluxo completo de autenticação', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        name: 'Admin',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin_global',
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('user');
    expect(registerResponse.body).toHaveProperty('accessToken');
    expect(registerResponse.body).toHaveProperty('refreshToken');

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: '123456' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('accessToken');
    expect(loginResponse.body).toHaveProperty('refreshToken');

    const refreshResponse = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty('accessToken');

    const resetResponse = await request(app)
      .post('/auth/reset-password')
      .send({ email: 'admin@test.com' });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body).toEqual({ message: 'Reset link sent (mock)' });
  });
});
