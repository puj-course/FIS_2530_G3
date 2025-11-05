import { Router } from 'express';
import { crearSolicitudIntercambio, decidirSolicitudIntercambio } from '../controllers/solicitudes.controller';

const router = Router();

router.post('/intercambio', crearSolicitudIntercambio);
router.patch('/intercambio/:solicitudId/decidir', decidirSolicitudIntercambio);

export default router;
<<<<<<< HEAD
=======

>>>>>>> samuelDaza
