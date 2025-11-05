import { Request, Response } from 'express';
import { DonacionService } from './services/donacion.service';

export const generarReciboDonacion = async (req: Request, res: Response) => {
  try {
    const { donanteId, publicacionId } = req.body;
    const recibo = await DonacionService.generarRecibo(donanteId, publicacionId);
    res.status(201).json(recibo);
  } catch (e:any) { res.status(400).json({ error: e.message }); }
};
