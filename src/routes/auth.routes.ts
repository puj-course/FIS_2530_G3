import { Router, Request, Response } from "express";
import { register, login, me, getUsers } from "../controllers/auth.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Helper para manejar promesas sin repetir try/catch
const wrap =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response) =>
    fn(req, res).catch((err) => {
      console.error(`❌ Error en ${req.method} ${req.originalUrl}:`, err);
      res.status(500).json({ message: "Error interno" });
    });

// ----- Rutas públicas -----
router.post("/register", wrap(register));
router.post("/login", wrap(login));

// ----- Rutas protegidas (token requerido) -----
router.get("/me", auth, wrap(me));

// Listar usuarios (solo ADMIN)
router.get("/users", auth, requireRole("ADMIN"), wrap(getUsers));

// Ping para validar protección de ADMIN
router.get("/admin/ping", auth, requireRole("ADMIN"), (_req, res) => {
  res.json({ ok: true, msg: "Hola ADMIN 👋" });
});

export default router;