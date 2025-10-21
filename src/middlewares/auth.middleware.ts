import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface ReqAuth extends Request {
  userId?: string;
}

export const auth = (req: ReqAuth, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No se proporcionó token de autenticación" });

    const token = header.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ message: "Token inválido o vacío" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Error interno de configuración" });

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload | { id?: string; sub?: string };

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({ message: "Token inválido" });
    }

    // ✅ Acepta tokens con 'id' o con 'sub'
    const uid = (decoded as any).id ?? (decoded as any).sub;
    if (!uid) return res.status(401).json({ message: "Token inválido" });

    req.userId = String(uid);
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Alias opcional si en algún archivo importas requireAuth
export const requireAuth = auth;
