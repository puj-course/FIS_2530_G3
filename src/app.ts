import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

// 🔑 Necesario para leer JSON en el body
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

export default app;
