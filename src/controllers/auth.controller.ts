// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.schema";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { hashPassword } from "../utils/hash";

type RoleName = "ADMIN" | "USER";

export async function register(req: Request, res: Response) {
  try {
    // 1) Validar payload (stripUnknown elimina campos no permitidos)
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

    const {
      username,
      email,
      password,
      role, // ← viene del esquema; default "USER" si no lo envían
    }: {
      username: string;
      email: string;
      password: string;
      role?: RoleName;
    } = value;

    // 2) Duplicados por email/username
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email o username ya está en uso" });
    }

    // 3) Resolver rol (fallback a USER por si acaso)
    const roleName: RoleName = (role as RoleName) ?? "USER";
    let roleDoc = await Role.findOne({ name: roleName });
    if (!roleDoc) {
      // si no existe lo creamos (útil en dev)
      roleDoc = await Role.create({ name: roleName });
    }

    // 4) Hash de contraseña
    const passwordHash = await hashPassword(password);

    // 5) Crear usuario
    const user = await User.create({
      username,
      email,
      passwordHash,
      roleId: roleDoc._id,
      status: "ACTIVE",
    });

    // 6) Responder (sin passwordHash)
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
