import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", (req, res) =>
  register(req, res).catch((err) => {
    console.error("❌ Error en /auth/register:", err);
    res.status(500).json({ message: "Error interno" });
  })
);

router.post("/login", (req, res) =>
  login(req, res).catch((err) => {
    console.error("❌ Error en /auth/login:", err);
    res.status(500).json({ message: "Error interno" });
  })
);

router.get("/me", auth, (req, res) =>
  me(req, res).catch((err) => {
    console.error("❌ Error en /auth/me:", err);
    res.status(500).json({ message: "Error interno" });
  })
);

router.get("/admin/ping", auth, requireRole("ADMIN"), (_req, res) => {
  res.json({ ok: true, msg: "Hola ADMIN 👋" });
});

export default router;
