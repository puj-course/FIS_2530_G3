import request from 'supertest';
import app from '../src/app';

describe('Iniciar sesión', () => {
  test('✅ Positiva', async () => {
    await request(app).post('/api/auth/register').send({ nombre: 'Laura', email: 'login@test.com', password: '12345678', rol: 'usuario' });
    const res = await request(app).post('/api/auth/login').send({ email: 'login@test.com', password: '12345678' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('❌ Negativa', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'invalido@test.com', password: '0000' });
    expect(res.status).toBe(401);
  });

  test('⚠️ Borde', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: '', password: '' });
    expect(res.status).toBe(400);
  });
});
