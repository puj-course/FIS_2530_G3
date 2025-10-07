import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthPayload {
  sub: string;           
  username: string;
  role: "ADMIN" | "USER";
}

// Middleware: valida token y guarda payload en req.user
export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const payload = verifyJwt<AuthPayload>(token);
    if (!payload) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    (req as any).user = payload; // guarda el payload en la request
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Middleware: valida rol específico (ej: ADMIN)
export function requireRole(...roles: AuthPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload;
    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    return next();
  };
}