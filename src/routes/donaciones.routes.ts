import { Router } from 'express';
import { generarReciboDonacion } from '../controllers/donaciones.controller';

const router = Router();

router.post('/recibo', generarReciboDonacion);

export default router;
