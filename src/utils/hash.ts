import bcrypt from "bcrypt";

const rounds = Number(process.env.BCRYPT_ROUNDS || 11);

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, rounds);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
