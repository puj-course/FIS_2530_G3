// tests/setup/env.setup.ts

// Si tu frontend lee import.meta.env.VITE_API_URL, en Jest (Node) no existe import.meta.
// Forzamos un valor por defecto vía process.env. Tu AppConfig ya usa fallback si está vacío.
process.env.VITE_API_URL = process.env.VITE_API_URL ?? '';

// También es común usar JWT_SECRET en middlewares de auth en pruebas
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
