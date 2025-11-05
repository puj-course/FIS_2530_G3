// src/routes/users.routes.ts
import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  seguirPublicacion,
  dejarSeguirPublicacion,
  enviarNotificacion,
} from "../controllers/users.controller";

const router = Router();

// CRUD
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Funcionalidades del diagrama
router.post("/:id/follow/:pubId", seguirPublicacion);
router.delete("/:id/follow/:pubId", dejarSeguirPublicacion);
router.post("/:id/notify", enviarNotificacion);

export default router;
