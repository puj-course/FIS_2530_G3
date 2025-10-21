import { Router } from "express";
import {
  crearPrenda,
  listarPrendas,
  obtenerPrenda,
  actualizarPrenda,
  eliminarPrenda,

} from "../controllers/prendas.controller";

const router = Router();

router.post("/", crearPrenda);
router.get("/", listarPrendas);
router.get("/:id", obtenerPrenda);
router.put("/:id", actualizarPrenda);
router.delete("/:id", eliminarPrenda);

// método del diagrama: esValida()
router.get("/:id/valida", validarPrenda);

export default router;
