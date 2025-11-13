import request from 'supertest';
import app from '../../../src/app';

describe('app.ts', () => {
  it('GET / debe responder 200 (o lo que tengas configurado)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBeLessThan(500); // ajústalo si sabes el código exacto
  });

  it('GET /health debe responder 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('devuelve 404 en /api cuando el recurso no existe', async () => {
    const res = await request(app).get('/api/ruta-que-no-existe');
    expect(res.status).toBe(404);
    // Si tu mensaje es diferente, ajusta:
    expect(res.body).toHaveProperty('error');
  });
});
