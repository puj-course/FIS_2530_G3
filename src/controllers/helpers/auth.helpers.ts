import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type IdLike = string | Types.ObjectId | undefined;

export interface MinimalUser {
  id?: IdLike;
  _id?: IdLike;
  nombre?: string;
  email?: string;
  rol?: string;
  [k: string]: any;
}

function toIdString(id: IdLike): string | undefined {
  if (!id) return undefined;
  return typeof id === 'string' ? id : id.toString();
}

export function signToken(user: MinimalUser) {
  const secret = process.env.JWT_SECRET || 'test-secret';

  // Acepta tokens con 'id' o con '_id' (ObjectId o string)
  const uid = toIdString(user.id) ?? toIdString(user._id);
  if (!uid) {
    throw new Error('No se pudo determinar el id del usuario para firmar el token');
  }

  return jwt.sign({ sub: uid }, secret, { expiresIn: '1h' });
}

export function sanitizeUser(user: MinimalUser) {
  const { password, ...rest } = user;
  return rest;
}
