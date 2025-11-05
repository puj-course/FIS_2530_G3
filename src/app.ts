// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

// Rutas
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import publicacionesRoutes from "./routes/publicaciones.routes";
import categoriasRoutes from "./routes/categoria.routes";
import prendasRoutes from "./routes/prendas.routes";
import solicitudesRoutes from "./routes/solicitudes.routes";
import donacionesRoutes from "./routes/donaciones.routes";

const app = express();

/* -------------------- Configuración CORS -------------------- */
/**
 * FRONTEND_URL puede venir del .env, ej.:
 * FRONTEND_URL=http://localhost:5173
 * Si no está definida, por defecto permite el Vite local.
 */
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // usamos Bearer token, no cookies
};

/* -------------------- Middlewares globales -------------------- */
app.use(helmet({
  // Permite servir imágenes/recursos estáticos desde otros orígenes si hiciera falta
  crossOriginResourcePolicy: false,
}));
app.use(cors(corsOptions));
// Manejo explícito de preflight
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* -------------------- Rutas base (status/health) -------------------- */
app.get("/", (_req: Request, res: Response) => {
  res.send("API EcoModa funcionando correctamente");
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "ecomoda-api" });
});

app.get("/api/version", (_req: Request, res: Response) => {
  res.json({ version: process.env.npm_package_version || "1.0.0" });
});

/* -------------------- Rutas principales /api -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/prendas", prendasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/donaciones", donacionesRoutes);

/* -------------------- 404 para rutas no encontradas -------------------- */
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

/* -------------------- Manejador de errores -------------------- */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const payload: Record<string, any> = {
    error: err.message || "Error interno del servidor",
  };

  // En desarrollo enviamos algo de stack para depurar
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
});

export default app;
