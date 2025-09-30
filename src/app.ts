import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// 👇 usa este prefijo si quieres /auth/...
app.use("/auth", authRoutes);

export default app;
