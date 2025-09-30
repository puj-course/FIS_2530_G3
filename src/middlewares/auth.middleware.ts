import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthPayload {
  sub: string;           // user id
  username: string;
  role: "ADMIN" | "USER";
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const payload = verifyJwt<AuthPayload>(token);
    // guarda el payload para siguientes handlers
    (req as any).user = payload; // simple; si quieres tipar fuerte, hacemos un d.ts

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

// Guard para roles específicos
export function requireRole(...roles: AuthPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload | undefined;
    if (!user) return res.status(401).json({ message: "No autenticado" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
}
