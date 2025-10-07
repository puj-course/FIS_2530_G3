import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

import User from "../models/user.model";
import Role from "../models/role.model";
import { registerSchema, loginSchema } from "../validators/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey123";

// 🟩 REGISTER
export async function register(req: Request, res: Response) {
  const { value, error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validación fallida",
      details: error.details.map((d: Joi.ValidationErrorItem) => d.message),
    });
  }

  const { username, email, password } = value;
  const roleName = value.role || "USER";

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }

  const role = await Role.findOne({ name: roleName });
  if (!role) return res.status(400).json({ message: "Rol no encontrado" });

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    passwordHash,
    roleId: role._id,
  });

  await newUser.save();

  return res.status(201).json({ message: "Usuario creado exitosamente" });
}

// 🟩 LOGIN
export async function login(req: Request, res: Response) {
  const { value, error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validación fallida",
      details: error.details.map((d: Joi.ValidationErrorItem) => d.message),
    });
  }

  const { email, password } = value;

  const user = await User.findOne({ email }).populate("roleId");
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      role: (user.roleId as any).name, // "ADMIN" | "USER"
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({ token });
}

// 🟩 ME (perfil)
export async function me(req: Request, res: Response) {
  const payload = (req as any).user;
  if (!payload) return res.status(401).json({ message: "No autenticado" });

  const dbUser = await User.findById(payload.sub).populate("roleId", "name");
  if (!dbUser) return res.status(404).json({ message: "Usuario no encontrado" });

  return res.json({
    id: dbUser._id,
    username: dbUser.username,
    email: dbUser.email,
    role: (dbUser.roleId as any).name,
    createdAt: dbUser.createdAt,
  });
}

// 🟩 GET USERS (solo ADMIN)
export async function getUsers(req: Request, res: Response) {
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .populate("roleId", "name")
    .skip(skip)
    .limit(limit)
    .select("-passwordHash");

  return res.json({
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    data: users.map((u) => ({
      id: u._id,
      username: u.username,
      email: u.email,
      role: (u.roleId as any).name,
      createdAt: u.createdAt,
    })),
  });
}

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
  res.json(users);
}