import { Router, Request, Response, NextFunction } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { auth as requireAuth } from "../middlewares/auth.middleware";

<<<<<<< HEAD
=======

>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
const router = Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

// Healthcheck opcional
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "auth" });
});
<<<<<<< HEAD
=======
// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

// Healthcheck opcional
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "auth" });
});
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38

// Error handler tipado (arregla TS7006)
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Auth route error:", err);
  res.status(500).json({ message: "Auth route error", error: err?.message });
});
<<<<<<< HEAD
=======
// Error handler tipado (arregla TS7006)
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Auth route error:", err);
  res.status(500).json({ message: "Auth route error", error: err?.message });
});
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38

export default router; 