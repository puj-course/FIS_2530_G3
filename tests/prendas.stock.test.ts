import request from 'supertest';
import app from '../src/app';

describe('Actualizar stock', () => {
  test('✅ Positiva', async () => {
    const res = await request(app).put('/api/prendas/1/stock').send({ cantidad: -1 });
    expect(res.status).toBe(200);
  });

  test('❌ Negativa', async () => {
    const res = await request(app).put('/api/prendas/1/stock').send({ cantidad: -10 });
    expect(res.status).toBe(400);
  });
});
