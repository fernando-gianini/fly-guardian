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
      return { sub: `${role}-user`, role };
    }),
  };
});

const sendWhatsAppMessageMock = jest.fn(async () => ({ sid: 'mock-sid' }));
jest.mock('../src/integrations/whatsapp.adapter.fg.js', () => ({
  sendWhatsAppMessage: sendWhatsAppMessageMock,
}));

import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import alertRoutes from '../src/routes/alert.routes.fg.js';
import { errorHandler } from '../src/middleware/errorHandler.fg.js';

const MORADOR_TOKEN = 'morador-token';
const OPERADOR_TOKEN = 'operador-token';
const ADMIN_TOKEN = 'admin-token';

describe('Alertas e Emergencias', () => {
  let app: express.Express;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: 'flyguardian-alerts-test' });

    app = express();
    app.use(express.json());
    app.use(alertRoutes);
    app.use(errorHandler);
  });

  afterEach(async () => {
    sendWhatsAppMessageMock.mockClear();
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('executa fluxo completo de alertas', async () => {
    const emergencyResponse = await request(app)
      .post('/alerts/emergency')
      .set('Authorization', `Bearer ${MORADOR_TOKEN}`)
      .send({
        location: { lat: -23.5, lng: -46.6 },
        note: 'Barulho suspeito',
        priority: 'high',
      });

    expect(emergencyResponse.status).toBe(201);
    expect(emergencyResponse.body.ok).toBe(true);
    const emergencyId = emergencyResponse.body.data.id;

    const policeResponse = await request(app)
      .post('/alerts/190')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({ note: 'Acionamento 190' });

    expect(policeResponse.status).toBe(201);
    expect(policeResponse.body.ok).toBe(true);
    expect(sendWhatsAppMessageMock).toHaveBeenCalledTimes(1);

    const listResponse = await request(app)
      .get('/alerts')
      .set('Authorization', `Bearer ${OPERADOR_TOKEN}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.ok).toBe(true);
    expect(listResponse.body.data).toHaveLength(2);

    const statusResponse = await request(app)
      .patch(`/alerts/${emergencyId}/status`)
      .set('Authorization', `Bearer ${OPERADOR_TOKEN}`)
      .send({ status: 'em_atendimento' });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.ok).toBe(true);
    expect(statusResponse.body.data.status).toBe('em_atendimento');
    const timeline = statusResponse.body.data.timeline;
    const hasStatusEntry = timeline.some((entry: any) => entry.event === 'status_changed');
    expect(hasStatusEntry).toBe(true);
  });
});
