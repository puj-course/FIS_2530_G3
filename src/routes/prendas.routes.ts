import { Router } from "express";
import {
  crearPrenda,
  listarPrendas,
  obtenerPrenda,
  actualizarPrenda,
  eliminarPrenda,
<<<<<<< HEAD

=======
  validarPrenda,          // 👈 nuevo
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
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
