import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { auth as authMiddleware } from '../../../src/middlewares/auth.middleware';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const mockReq = (header?: string) =>
  ({ headers: header ? { authorization: header } : {} } as unknown as Request);

const mockRes = () => {
  const res = {} as Response & { status: jest.Mock; json: jest.Mock };
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn() as unknown as NextFunction;

describe('middlewares/auth.middleware (auth)', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  it('retorna 401 si no hay Authorization', () => {
    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No se proporcionó token de autenticación' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 si el token es vacío o inválido después de "Bearer "', () => {
    const req = mockReq('Bearer   ');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o vacío' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 si jwt.verify lanza error', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid token'); });

    const req = mockReq('Bearer INVALIDO');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 401 si jwt.verify no devuelve objeto válido', () => {
    (jwt.verify as jest.Mock).mockReturnValue('string-cualquiera');

    const req = mockReq('Bearer VALID');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
  });

  it('retorna 401 si el payload no tiene id ni sub', () => {
    (jwt.verify as jest.Mock).mockReturnValue({});

    const req = mockReq('Bearer VALID');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
  });

  it('llama next() y asigna req.userId cuando el token trae sub', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1' });

    const req = mockReq('Bearer VALID');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    // @ts-ignore
    expect(req.userId).toBe('u1');
    expect(next).toHaveBeenCalled();
  });

  it('llama next() y asigna req.userId cuando el token trae id', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'abc-123' });

    const req = mockReq('Bearer VALID');
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    // @ts-ignore
    expect(req.userId).toBe('abc-123');
    expect(next).toHaveBeenCalled();
  });
});
