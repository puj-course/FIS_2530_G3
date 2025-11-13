import type { Request, Response } from 'express';
import { generarReciboDonacion } from '../../../src/controllers/donaciones.controller';
import { DonacionService } from '../../../src/controllers/services/donacion.service';

jest.mock('../../src/controllers/services/donacion.service', () => ({
  DonacionService: {
    generarRecibo: jest.fn(),
  },
}));

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json } as unknown as Response & {
    status: jest.Mock;
    json: jest.Mock;
  };
};

describe('donaciones.controller - generarReciboDonacion', () => {
  it('devuelve 201 con el recibo generado', async () => {
    const req = {
      body: { donanteId: 'u1', publicacionId: 'p1' },
    } as Request;
    const res = mockRes();

    (DonacionService.generarRecibo as jest.Mock).mockResolvedValue({
      id: 'r1',
      donanteId: 'u1',
      publicacionId: 'p1',
    });

    await generarReciboDonacion(req, res);

    expect(DonacionService.generarRecibo).toHaveBeenCalledWith('u1', 'p1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'r1' }),
    );
  });

  it('devuelve 400 cuando DonacionService lanza error', async () => {
    const req = {
      body: { donanteId: 'u1', publicacionId: 'p1' },
    } as Request;
    const res = mockRes();

    (DonacionService.generarRecibo as jest.Mock).mockRejectedValue(
      new Error('Algo salió mal'),
    );

    await generarReciboDonacion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Algo salió mal' }),
    );
  });
});
