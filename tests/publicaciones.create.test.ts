import request from 'supertest';
import app from '../src/app';

describe('Crear publicación', () => {
  test('✅ Positiva', async () => {
    const user = await request(app).post('/api/auth/register').send({ nombre: 'L', email: 'pub@test.com', password: '12345678', rol: 'usuario' });
    const login = await request(app).post('/api/auth/login').send({ email: 'pub@test.com', password: '12345678' });
    const token = login.body.token;

    const res = await request(app)
      .post('/api/publicaciones')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Camisa azul', descripcion: 'Talla M', tipo: 'venta', precio: 25000 });

    expect(res.status).toBe(201);
  });

  test('❌ Sin token', async () => {
    const res = await request(app).post('/api/publicaciones').send({ titulo: 'X', descripcion: 'Y' });
    expect(res.status).toBe(401);
  });
});
