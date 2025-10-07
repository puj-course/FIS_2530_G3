import { Router } from "express";
import { auth, requireRole } from "../middlewares/auth.middleware";
import { listUsers } from "../controllers/users.controller"; // debe exportarse nombrado

const router = Router();

// GET /users  (solo ADMIN)
router.get("/", auth, requireRole("ADMIN"), (req, res) =>
  listUsers(req, res).catch((err) => {
    console.error("❌ Error en GET /users:", err);
    res.status(500).json({ message: "Error interno" });
  })
);

export default router; // <-- hace que el archivo SEA un módulo