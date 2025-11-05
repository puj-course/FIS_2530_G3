/* eslint-disable no-console */
const BASE = process.env.BASE_URL || "http://localhost:3000/api";
const email1 = process.env.EMAIL1 || "demo1@ecomoda.com";
const pass1  = process.env.PASS1  || "123456";
const email2 = process.env.EMAIL2 || "demo2@ecomoda.com";
const pass2  = process.env.PASS2  || "123456";

type JSONish = Record<string, any>;

async function req(path: string, opts: any = {}, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let body: JSONish = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!res.ok) throw new Error(`${opts.method || "GET"} ${path} -> ${res.status} ${JSON.stringify(body)}`);
  return body;
}

async function maybe(fn: () => Promise<any>, tag: string) {
  try { await fn(); console.log("✔", tag); }
  catch (e:any) { console.log("ℹ", tag, ":", e.message); }
}

async function main() {
  console.log("🔥 Smoke test on:", BASE);

  // ===== AUTH =====
  await maybe(() => req("/auth/register", { method: "POST", body: JSON.stringify({ nombre:"Demo1", email:email1, password:pass1 }) }), "register user1");
  await maybe(() => req("/auth/register", { method: "POST", body: JSON.stringify({ nombre:"Demo2", email:email2, password:pass2 }) }), "register user2");

  const login1 = await req("/auth/login", { method: "POST", body: JSON.stringify({ email: email1, password: pass1 }) });
  const token1 = login1.token as string;
  const user1  = login1.user?._id ?? login1.userId ?? login1.id ?? "n/a";
  console.log("✔ login1", user1);

  const login2 = await req("/auth/login", { method: "POST", body: JSON.stringify({ email: email2, password: pass2 }) });
  const token2 = login2.token as string;
 const user2  = login2.user?._id ?? login2.userId ?? login2.id ?? "n/a";
  console.log("✔ login2", user2);

  // ===== CATEGORÍA =====
  await maybe(() => req("/categorias", { method:"POST", body: JSON.stringify({ nombre:"Camisas" }) }, token1), "crear categoría");

  // ===== PRENDA =====
  const prenda = await req("/prendas", {
    method: "POST",
    body: JSON.stringify({ nombre:"Camisa blanca", talla:"M", color:"Blanco", categoria:"Camisas" })
  }, token1);
  console.log("✔ prenda", prenda._id);

  // ===== PUBLICACIÓN (VENTA) =====
  const pubVenta = await req("/publicaciones", {
    method: "POST",
    body: JSON.stringify({ prenda: prenda._id, tipo:"venta", precio:45000, estado:"activa", stock:2 })
  }, token1);
  console.log("✔ pubVenta", pubVenta._id);

  // seguir / dejar de seguir (user2)
  await req(`/publicaciones/${pubVenta._id}/seguir`, { method:"POST" }, token2);
  console.log("✔ seguir");
  await req(`/publicaciones/${pubVenta._id}/dejar-seguir`, { method:"POST" }, token2);
  console.log("✔ dejar-seguir");

  // actualizar precio, cambiar estado
  await req(`/publicaciones/${pubVenta._id}`, { method:"PUT", body: JSON.stringify({ precio:39999 }) }, token1);
  console.log("✔ actualizar precio");
  await req(`/publicaciones/${pubVenta._id}/estado`, { method:"POST", body: JSON.stringify({ estado:"pausada" }) }, token1);
  console.log("✔ cambiar estado -> pausada");
  await req(`/publicaciones/${pubVenta._id}/estado`, { method:"POST", body: JSON.stringify({ estado:"activa" }) }, token1);
  console.log("✔ cambiar estado -> activa");

  // listar y obtener
  await req("/publicaciones?tipo=venta&limit=5");
  console.log("✔ listar publicaciones");
  await req(`/publicaciones/${pubVenta._id}`);
  console.log("✔ obtener publicación");

  // ===== LIMPIEZA =====
  await req(`/publicaciones/${pubVenta._id}`, { method:"DELETE" }, token1);
  console.log("🧹 elim pubVenta");

  console.log("✅ SMOKE OK");
}
//ccccccccccccccccccccccccccccc estoy en smoke.ts
main().catch((e) => {
  console.error("❌ SMOKE FAIL:", e.message);
  process.exit(1);
});
