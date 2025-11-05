// src/routes/users.routes.ts
<<<<<<< HEAD
=======
// src/routes/users.routes.ts
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
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
<<<<<<< HEAD
=======
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
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38

export default router;