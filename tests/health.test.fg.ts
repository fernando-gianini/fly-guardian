import request from 'supertest';
import app from '../src/app.fg.ts';

describe('GET /health', () => {
  it('deve responder com status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });
});
