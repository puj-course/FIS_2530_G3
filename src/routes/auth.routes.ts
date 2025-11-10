import { Router, Request, Response, NextFunction } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { auth as requireAuth } from "../middlewares/auth.middleware";
import { testSms } from "../controllers/test.controller"; // 👈 nuevo import

const router = Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

// Healthcheck opcional
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "auth" });
});

// Error handler tipado (arregla TS7006)
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Auth route error:", err);
  res.status(500).json({ message: "Auth route error", error: err?.message });
});

//temporal

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);

// 👇 NUEVA RUTA DE PRUEBA
router.post("/test-sms", testSms);

export default router;
