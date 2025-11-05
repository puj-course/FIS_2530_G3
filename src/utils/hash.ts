<<<<<<< HEAD
import bcrypt from "bcrypt";

const rounds = Number(process.env.BCRYPT_ROUNDS || 11);

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, rounds);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
=======
// src/utils/hash.ts
// Utilidades de hashing con bcryptjs (sin dependencias nativas).
// Soporta "pepper" opcional vía variable de entorno y define versiones async/sync.

import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);
const PEPPER = process.env.PEPPER ?? '';

/**
 * Genera el hash de una contraseña en forma asíncrona.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (!plain) throw new Error('Password is required');
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain + PEPPER, salt);
}

/**
 * Compara una contraseña en texto plano contra un hash (asíncrono).
 */
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  if (!hashed) return false;
  return bcrypt.compare(plain + PEPPER, hashed);
}

/**
 * Versión síncrona del hash (útil en scripts o tests).
 */
export function hashPasswordSync(plain: string): string {
  if (!plain) throw new Error('Password is required');
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(plain + PEPPER, salt);
}

/**
 * Versión síncrona de la comparación.
 */
export function comparePasswordSync(plain: string, hashed: string): boolean {
  if (!hashed) return false;
  return bcrypt.compareSync(plain + PEPPER, hashed);
}

export default {
  hashPassword,
  comparePassword,
  hashPasswordSync,
  comparePasswordSync,
};
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
