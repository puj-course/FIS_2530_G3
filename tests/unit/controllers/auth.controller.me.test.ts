import type { Request, Response } from 'express';
import Usuario from '../../../src/models/user.model';
import { me } from '../../../src/controllers/auth.controller';

jest.mock('../../src/models/user.model', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

const mockUserModel = Usuario as any;

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: jest.Mock;
    json: jest.Mock;
  };
};

describe('auth.controller - me', () => {
  it('devuelve 401 si no hay usuario en req', async () => {
    const req = { user: undefined } as any as Request & { user?: { id: string } };
    const res = mockRes();

    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('devuelve 404 si no encuentra el usuario', async () => {
    const req = { user: { id: '123' } } as any;
    const res = mockRes();

    mockUserModel.findById.mockResolvedValue(null);

    await me(req as any, res as any);

    expect(mockUserModel.findById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devuelve 200 y el usuario si todo va bien', async () => {
    const req = { user: { id: '123' } } as any;
    const res = mockRes();

    mockUserModel.findById.mockResolvedValue({
      id: '123',
      nombre: 'Sam',
      email: 'sam@example.com',
      direccion: 'Calle 1',
      rol: 'USER',
    });

    await me(req as any, res as any);

    expect(mockUserModel.findById).toHaveBeenCalledWith('123');
    expect(res.status).not.toHaveBeenCalled(); // responde con res.json directo
    expect(res.json).toHaveBeenCalled();
  });
});
