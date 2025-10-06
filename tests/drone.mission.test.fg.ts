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
      const role = roleMap[token] ?? Roles.morador;
      return { sub: 'test-user', role };
    }),
  };
});

import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import droneRoutes from '../src/routes/drone.routes.fg.js';
import missionRoutes from '../src/routes/mission.routes.fg.js';
import { errorHandler } from '../src/middleware/errorHandler.fg.js';

const ADMIN_TOKEN = 'admin-token';

describe('Operacoes de Drones e Missoes', () => {
  let app: express.Express;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'flyguardian-ops-test' });

    app = express();
    app.use(express.json());
    app.use(droneRoutes);
    app.use(missionRoutes);
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

  it('executa fluxo completo de drone, missao e historico', async () => {
    const droneResponse = await request(app)
      .post('/drones')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        model: 'Matrice 300 RTK',
        serial: 'OPS-DRN-001',
        batteryPct: 87,
        status: 'ativo',
        notes: 'Unidade principal de patrulha',
      });

    expect(droneResponse.status).toBe(201);
    const droneId = droneResponse.body.id;
    expect(droneId).toBeDefined();

    const missionResponse = await request(app)
      .post('/missions')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        name: 'Missao Perimetro 01',
        droneId,
        waypoints: [
          { lat: -23.55, lng: -46.63, alt: 110, speed: 12 },
          { lat: -23.551, lng: -46.632, alt: 115, speed: 12 },
        ],
        etaSeconds: 900,
        status: 'planejada',
        notes: 'Turno noturno',
      });

    expect(missionResponse.status).toBe(201);
    const missionId = missionResponse.body.id;
    expect(missionId).toBeDefined();

    const listMissionsResponse = await request(app)
      .get('/missions')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(listMissionsResponse.status).toBe(200);
    expect(Array.isArray(listMissionsResponse.body)).toBe(true);
    expect(listMissionsResponse.body.length).toBe(1);

    const statusResponse = await request(app)
      .patch(`/missions/${missionId}/status`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({ status: 'em_execucao', approvedBy: 'cco.marcos' });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe('em_execucao');

    const historyResponse = await request(app)
      .post('/flight-history')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        missionId,
        droneId,
        startedAt: '2025-01-10T23:00:00Z',
        endedAt: '2025-01-10T23:20:00Z',
        log: {
          distanceKm: 6.4,
          incidents: [],
          notes: 'Missao concluida sem incidentes.',
        },
      });

    expect(historyResponse.status).toBe(201);
    expect(historyResponse.body).toHaveProperty('id');

    const listHistoryResponse = await request(app)
      .get(`/flight-history?missionId=${missionId}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    expect(listHistoryResponse.status).toBe(200);
    expect(Array.isArray(listHistoryResponse.body)).toBe(true);
    expect(listHistoryResponse.body.length).toBe(1);
    expect(listHistoryResponse.body[0].missionId).toBe(missionId);
  });
});
