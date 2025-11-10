import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import Usuario, { IUsuario } from '../models/user.model';
import { NotificationFacade } from './services/notifications/NotificationFacade';


const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_SECRET';

/* ──────────────────────────────────────────────────────────────
 * Validaciones (Joi)
 * ────────────────────────────────────────────────────────────── */
const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  direccion: Joi.string().allow('', null),
  // rol es opcional, por defecto 'usuario'
  rol: Joi.string().valid('usuario', 'admin').optional(),
  // NUEVO: teléfono opcional en formato E.164 (ej: +573001112233)
  telefono: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

function signToken(user: IUsuario) {
  return jwt.sign(
    {
      sub: user.id,        // usar string del id
      nombre: user.nombre, // mostramos nombre en el token
      rol: user.rol,       // 'usuario' | 'admin'
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function sanitizeUser(user: IUsuario) {
  // createdAt/updatedAt existen por timestamps, pero no están tipados en la interfaz:
  const anyUser = user as any;
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    direccion: user.direccion ?? '',
    rol: user.rol,
    // NUEVO: exponer teléfono si existe
    telefono: (user as any)?.telefono ?? undefined,
    createdAt: anyUser?.createdAt,
    updatedAt: anyUser?.updatedAt,
  };
}

/* ──────────────────────────────────────────────────────────────
 * Controladores
 * ────────────────────────────────────────────────────────────── */

export const register = async (req: Request, res: Response) => {
  try {
    const { value, error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: 'Datos inválidos', details: error.details });
    }

    const { nombre, email, password, direccion, rol, telefono } = value;

    // ¿ya existe?
    const exists = await Usuario.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ ok: false, message: 'El email ya está registrado' });
    }
    // hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await Usuario.create({
      nombre,
      email,
      password: hash,
      direccion: direccion ?? '',
      rol: rol ?? 'usuario',
      // NUEVO: guardar teléfono si tu schema lo soporta
      ...(telefono ? { telefono } : {}),
    });

    const token = signToken(user);

    // ──────────────────────────────────────────────────────────
    // NUEVO: Disparar SMS de "usuario creado" (no bloqueante)
    // ──────────────────────────────────────────────────────────
    NotificationFacade.getInstancia()
      .userCreated({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: (user as any)?.telefono,
      })
      .catch((err) => console.error('[register] SMS failed:', err?.message));
    // ──────────────────────────────────────────────────────────

    return res.status(201).json({
      ok: true,
      user: sanitizeUser(user),
      token,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error interno' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { value, error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: 'Credenciales inválidas', details: error.details });
    }

    const { email, password } = value;

    const user = await Usuario.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const token = signToken(user);

    return res.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error interno' });
  }
};

export const me = async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ error: 'No autorizado' });

    const user = await Usuario.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    return res.json({ user: sanitizeUser(user) });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error interno' });
  }
};
