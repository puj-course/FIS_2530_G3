// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth.schema";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";

type RoleName = "ADMIN" | "USER";

/**
 * POST /auth/register
 * Crea un usuario con password hasheado y rol (por defecto USER).
 */
export async function register(req: Request, res: Response) {
  try {
    // Validación del payload (elimina campos no permitidos)
    const { value, error } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        message: "Validación fallida",
        details: error.details.map((d) => d.message),
      });
    }

    const { username, email, password, role } = value as {
      username: string;
      email: string;
      password: string;
      role?: RoleName;
    };

    // Duplicados por email o username
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: "Email o username ya está en uso" });
    }

    // Resolver rol (crearlo si no existe en dev)
    const roleName: RoleName = (role as RoleName) ?? "USER";
    let roleDoc = await Role.findOne({ name: roleName });
    if (!roleDoc) {
      roleDoc = await Role.create({ name: roleName });
    }

    // Hash de contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      passwordHash,
      roleId: roleDoc._id,
      status: "ACTIVE",
    });

    // Respuesta sin passwordHash
    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: roleDoc.name,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Error en /auth/register:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

/**
 * POST /auth/login
 * Verifica credenciales y devuelve JWT.
 */
export async function login(req: Request, res: Response) {
  try {
    const { value, error } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        message: "Validación fallida",
        details: error.details.map((d) => d.message),
      });
    }

    const { email, password } = value as { email: string; password: string };

    // Buscar usuario por email
    const user = await User.findOne({ email }).populate("roleId");
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Firmar JWT
    const payload = {
      sub: String(user._id),
      username: user.username,
      role: (user as any).roleId?.name ?? "USER",
    };
    const token = signJwt(payload);

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: payload.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en /auth/login:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

/**
 * GET /auth/me
 * Devuelve info básica del usuario autenticado (payload del JWT o consulta a DB).
 * Requiere el middleware `auth` que inyecta `req.user`.
 */
export async function me(req: Request, res: Response) {
  try {
    const payload = (req as any).user as
      | { sub: string; username: string; role: RoleName }
      | undefined;

    if (!payload) return res.status(401).json({ message: "No autenticado" });

    // Si prefieres devolver datos desde DB:
    // const user = await User.findById(payload.sub)
    //   .select("_id username email")
    //   .lean();
    // return res.json({ user });

    // Para respuesta rápida con lo que viene en el token:
    return res.json({
      user: {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en /auth/me:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}
