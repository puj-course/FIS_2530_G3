import authRoutes from '../../../src/routes/auth.routes';
import categoriaRoutes from '../../../src/routes/categoria.routes';
import donacionesRoutes from '../../../src/routes/donaciones.routes';
import prendasRoutes from '../../../src/routes/prendas.routes';
import publicacionesRoutes from '../../../src/routes/publicaciones.routes';
import solicitudesRoutes from '../../../src/routes/solicitudes.routes';
import usersRoutes from '../../../src/routes/users.routes';


describe('Rutas (routers de Express)', () => {
  it('deben estar definidas', () => {
    expect(authRoutes).toBeDefined();
    expect(categoriaRoutes).toBeDefined();
    expect(donacionesRoutes).toBeDefined();
    expect(prendasRoutes).toBeDefined();
    expect(publicacionesRoutes).toBeDefined();
    expect(solicitudesRoutes).toBeDefined();
    expect(usersRoutes).toBeDefined();
  });

  it('auth.routes debe tener al menos una ruta configurada', () => {
    const stack = (authRoutes as any).stack || [];
    expect(stack.length).toBeGreaterThan(0);
  });

  // puedes repetir algo similar para otras rutas si quieres
});
