// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";   // <- named import
import { Role } from "../models/role.model";   // <- named import
import { registerSchema, loginSchema } from "../validators/auth.schema";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt, verifyJwt } from "../utils/jwt";

/** Tipado opcional del payload del JWT */
type RoleName = "ADMIN" | "USER";
interface JwtPayload {
  sub: string;          // user id
  username: string;
  role: RoleName;
  iat?: number;
  exp?: number;
}

/** Helper: parsea Authorization: Bearer <token> */
function getTokenFromHeader(req: Request): string | null {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (!type || type.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/* ===========================================================
 * REGISTER  (POST /auth/register)
 *   - Usa passwordHash y roleId (ref a Role)
 * =========================================================== */
export async function register(req: Request, res: Response) {
  try {
    const result = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      return res.status(400).json({
        message: "Validación fallida",
        details: result.error.details.map((d) => d.message),
      });
    }
    if (!result.value) {
      return res.status(400).json({ message: "Cuerpo vacío o JSON inválido" });
    }

    const { username, email, password, role } = result.value as {
      username: string;
      email: string;
      password: string;
      role?: RoleName; // "ADMIN" | "USER"
    };

    // Unicidad
    if (await User.exists({ username })) {
      return res.status(409).json({ message: "El username ya está en uso" });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "El email ya está en uso" });
    }

    // Resolver roleId a partir del nombre de rol (opcional, default USER)
    const roleName: RoleName = role ?? "USER";
    const roleDoc = await Role.findOne({ name: roleName });
    if (!roleDoc) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      passwordHash,      // <- en tu schema
      roleId: roleDoc._id, // <- ref Role
      status: "ACTIVE",
    });

    return res.status(201).json({
      id: String(user._id),
      username: user.username,
      email: user.email,
      role: roleName,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Error en /auth/register:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

/* ===========================================================
 * LOGIN  (POST /auth/login)
 *   - Compara contra passwordHash
 *   - Saca el rol desde roleId (populate)
 * =========================================================== */
export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      return res.status(400).json({
        message: "Validación fallida",
        details: result.error.details.map((d) => d.message),
      });
    }
    if (!result.value) {
      return res.status(400).json({ message: "Cuerpo vacío o JSON inválido" });
    }

    const { email, password } = result.value as { email: string; password: string };

    const user = await User.findOne({ email })
      .populate({ path: "roleId", select: "name" }); // trae el rol

    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const roleName = (user.roleId && (user.roleId as any).name) as RoleName || "USER";

    const token = signJwt({
      sub: String(user._id),
      username: user.username,
      role: roleName,
    });

    return res.json({
      token,
      user: {
        id: String(user._id),
        username: user.username,
        email: user.email,
        role: roleName,
      },
    });
  } catch (err) {
    console.error("❌ Error en /auth/login:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

/* ===========================================================
 * ME  (GET /auth/me)
 *   - Lee token, busca usuario y popula rol
 * =========================================================== */
export async function me(req: Request, res: Response) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Token requerido" });

    const payload = verifyJwt<JwtPayload>(token);
    if (!payload) return res.status(401).json({ message: "Token inválido o expirado" });

    const user = await User.findById(payload.sub, { passwordHash: 0, __v: 0 })
      .populate({ path: "roleId", select: "name" })
      .lean();

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const roleName = (user.roleId as any)?.name ?? "USER";

    return res.json({
      id: String(user._id),
      username: user.username,
      email: user.email,
      role: roleName,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Error en /auth/me:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

/* ===========================================================
 * GET USERS  (GET /auth/users)  — Sub-issue #56
 *   - Paginado y populate(roleId)
 *   - No devuelve passwordHash
 * =========================================================== */
export async function getUsers(req: Request, res: Response) {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10), 1);
    const limit = Math.max(parseInt(String(req.query.limit ?? "20"), 10), 1);
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      User.countDocuments({}),
      User.find({}, { passwordHash: 0, __v: 0 })
        .populate({ path: "roleId", select: "name" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const data = users.map((u: any) => ({
      id: String(u._id),
      username: u.username,
      email: u.email,
      role: u.roleId?.name ?? "USER",
      status: u.status,
      createdAt: u.createdAt,
    }));

    return res.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
      data,
    });
  } catch (err) {
    console.error("❌ Error en getUsers:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}