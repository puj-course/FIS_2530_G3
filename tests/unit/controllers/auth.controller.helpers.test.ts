import * as jwt from 'jsonwebtoken';
import { signToken, sanitizeUser } from '../../../src/controllers/helpers/auth.helpers';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('controllers/auth.helpers', () => {
  const fakeUser: any = {
    id: 'abc123',
    nombre: 'Pepito',
    email: 'p@p.com',
    rol: 'usuario',
    password: 'no-deberia-salir',
  };

  it('signToken delega en jwt.sign', () => {
    (jwt.sign as jest.Mock).mockReturnValue('MI_TOKEN');
    const token = signToken(fakeUser);
    expect(token).toBe('MI_TOKEN');
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('sanitizeUser remueve password y deja campos seguros', () => {
    const sanitized = sanitizeUser(fakeUser);
    expect(sanitized).toHaveProperty('id', 'abc123');
    expect(sanitized).toHaveProperty('email', 'p@p.com');
    expect(sanitized).not.toHaveProperty('password');
  });
});
