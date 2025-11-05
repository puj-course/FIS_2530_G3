import request from 'supertest';
import app from '../src/app';

describe('Registrar donación', () => {
  test('✅ Positiva', async () => {
    const user = await request(app).post('/api/auth/register').send({ nombre: 'Laura', email: 'don@test.com', password: '12345678', rol: 'usuario' });
    const login = await request(app).post('/api/auth/login').send({ email: 'don@test.com', password: '12345678' });
    const token = login.body.token;

    const res = await request(app)
      .post('/api/donaciones')
      .set('Authorization', `Bearer ${token}`)
      .send({ idPrenda: '64f1b1a2...', receptor: '64f2a67c...' });

    expect(res.status).toBe(201);
  });
});
