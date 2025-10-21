// src/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
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

/* -------- Middlewares globales -------- */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* -------- Rutas principales -------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/prendas", prendasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/donaciones", donacionesRoutes);

/* -------- Ruta base -------- */
app.get("/", (_req, res) => {
  res.send("API EcoModa funcionando correctamente");
});

export default app;
