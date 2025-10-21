import { Request, Response } from 'express';
import { IntercambioService } from './services/intercambio.service';

export const crearSolicitudIntercambio = async (req: Request, res: Response) => {
  try {
    const { publicacionId, ofertanteId, descripcion } = req.body;
    const sol = await IntercambioService.crearSolicitud(publicacionId, ofertanteId, descripcion);
    res.status(201).json(sol);
  } catch (e:any) { res.status(400).json({ error: e.message }); }
};

export const decidirSolicitudIntercambio = async (req: Request, res: Response) => {
  try {
    const { solicitudId } = req.params;
    const { aceptar } = req.body;
    const sol = await IntercambioService.decidir(solicitudId, !!aceptar);
    res.json(sol);
  } catch (e:any) { res.status(400).json({ error: e.message }); }
};
