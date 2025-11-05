import { Router } from "express";
import {
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
  renombrarCategoria,
} from "../controllers/categoria.controller";

const router = Router();

router.post("/", crearCategoria);
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);
router.put("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

// método del diagrama
router.patch("/:id/renombrar", renombrarCategoria);

//ccccccccccccccccccccccccccccc estoy en categoria.routes.ts

export default router;
