import request from 'supertest';
import app from '../src/app';

describe('Registrar usuario', () => {
  test('✅ Positiva', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Laura', email: 'laura@example.com', password: '12345678', rol: 'usuario' });
    expect(res.status).toBe(201);
  });

  test('❌ Negativa', async () => {
    await request(app).post('/api/auth/register').send({ nombre: 'Laura', email: 'laura@example.com', password: '12345678', rol: 'usuario' });
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Laura', email: 'laura@example.com', password: '12345678', rol: 'usuario' });
    expect(res.status).toBe(400);
  });

  test('⚠️ Borde', async () => {
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Ana', email: 'ana@example.com', password: '123', rol: 'usuario' });
    expect(res.status).toBe(400);
  });
});
