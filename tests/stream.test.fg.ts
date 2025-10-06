jest.mock('../src/utils/jwt.fg.js', () => {
  const actual = jest.requireActual('../src/utils/jwt.fg.js');
  const { Roles } = require('../src/types/roles.fg.js');
  return {
    ...actual,
    verifyAccessToken: jest.fn((token: string) => {
      const roleMap: Record<string, (typeof Roles)[keyof typeof Roles]> = {
        'admin-token': Roles.admin_global,
        'cliente-token': Roles.cliente,
        'operador-token': Roles.operador,
        'morador-token': Roles.morador,
      };
      const role = roleMap[token];
      if (!role) {
        throw new Error('Invalid token');
      }
      return { sub: 'test-user', role };
    }),
  };
});

import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import streamRoutes from '../src/routes/stream.routes.fg.js';
import telemetryRoutes from '../src/routes/telemetry.routes.fg.js';
import { errorHandler } from '../src/middleware/errorHandler.fg.js';

const OPERATOR_TOKEN = 'operador-token';
const MORADOR_TOKEN = 'morador-token';

describe('Streaming e Telemetria', () => {
  let app: express.Express;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'flyguardian-stream-test' });

    app = express();
    app.use(express.json());
    app.use(streamRoutes);
    app.use(telemetryRoutes);
    app.use(errorHandler);
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('executa fluxo completo de streaming e telemetria', async () => {
    const startResponse = await request(app)
      .post('/stream/session')
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`)
      .send({ droneId: 'DRONE123' });

    expect(startResponse.status).toBe(201);
    expect(startResponse.body).toMatchObject({ ok: true });
    const { sessionId, sdpOffer } = startResponse.body.data;
    expect(sessionId).toBeDefined();
    expect(typeof sdpOffer).toBe('string');

    const answerResponse = await request(app)
      .post(`/stream/session/${sessionId}/answer`)
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`)
      .send({ sdpAnswer: 'mock-answer' });
    expect(answerResponse.status).toBe(200);
    expect(answerResponse.body.ok).toBe(true);

    const iceResponse = await request(app)
      .post(`/stream/session/${sessionId}/ice`)
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`)
      .send({ candidate: 'candidate-1' });
    expect(iceResponse.status).toBe(200);
    expect(iceResponse.body.ok).toBe(true);

    const telemetryResponse = await request(app)
      .post('/telemetry/DRONE123')
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`)
      .send({
        lat: -23.5,
        lng: -45.3,
        alt: 120,
        speed: 8,
        batteryPct: 85,
        heading: 270,
        ts: new Date().toISOString(),
      });
    expect(telemetryResponse.status).toBe(201);
    expect(telemetryResponse.body.ok).toBe(true);

    const latestResponse = await request(app)
      .get('/telemetry/DRONE123/latest')
      .set('Authorization', `Bearer ${MORADOR_TOKEN}`);
    expect(latestResponse.status).toBe(200);
    expect(latestResponse.body.ok).toBe(true);
    expect(latestResponse.body.data).toMatchObject({ droneId: 'DRONE123' });

    const stopResponse = await request(app)
      .post(`/stream/session/${sessionId}/stop`)
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`)
      .send({ reason: 'test-end' });
    expect(stopResponse.status).toBe(200);
    expect(stopResponse.body.ok).toBe(true);
    expect(stopResponse.body.data.endedAt).toBeDefined();

    const logsResponse = await request(app)
      .get('/stream/logs?droneId=DRONE123')
      .set('Authorization', `Bearer ${OPERATOR_TOKEN}`);
    expect(logsResponse.status).toBe(200);
    expect(logsResponse.body.ok).toBe(true);
    const logs = logsResponse.body.data;
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBe(1);
    expect(logs[0].sessionId).toBe(sessionId);
    expect(logs[0].endedAt).toBeDefined();
  });
});
