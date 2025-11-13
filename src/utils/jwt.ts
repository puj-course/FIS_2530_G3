import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'test-secret';

/**
 * Crea un token JWT
 */
export function signJwt(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

/**
 * Verifica un token JWT.
 * Si algo falla, devuelve null (NO lanza excepciones).
 */
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET) as object;
  } catch {
    return null; // ✅ Esto hará que tus pruebas pasen correctamente
  }
}
