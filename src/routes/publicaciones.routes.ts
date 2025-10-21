// src/routes/publicaciones.routes.ts
import { Router } from "express";
import {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
  seguirPublicacion,
  dejarSeguirPublicacion,
  cambiarEstadoPublicacion,
} from "../controllers/publicaciones.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Base: /api/publicaciones
 */

// Listado + filtros ?tipo=&estado=&duenio=&page=&limit=
router.get("/", listarPublicaciones);

// Obtener por id
router.get("/:id", obtenerPublicacion);

// Crear (donación/intercambio/venta) -> en el body manda { tipo: 'donacion'|'intercambio'|'venta', ... }
router.post("/", auth, crearPublicacion);

// Actualizar (precio, fotos, estado, stock si 'venta')
router.put("/:id", auth, actualizarPublicacion);

// Eliminar
router.delete("/:id", auth, eliminarPublicacion);

// Seguir / Dejar de seguir
router.post("/:id/seguir", auth, seguirPublicacion);
router.post("/:id/dejar-seguir", auth, dejarSeguirPublicacion);

// Cambiar estado (activa|pausada|cerrada)
router.post("/:id/estado", auth, cambiarEstadoPublicacion);

export default router;
