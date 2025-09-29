// src/routes/auth.routes.ts
import { Router } from "express";
import { register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", (req, res) =>
  register(req, res).catch(err => {
    console.error("❌ Error en /auth/register:", err);
    res.status(500).json({ message: "Error interno" });
  })
);

export default router; // 👈 importante
