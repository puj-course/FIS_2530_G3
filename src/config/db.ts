import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI.startsWith("mongodb")) {
      throw new Error("❌ MONGO_URI vacío o inválido. Revisa tu .env");
    }

    await mongoose.connect(MONGO_URI);

    // 🔹 Sincroniza índices de todos los modelos declarados (opcional pero recomendado)
    await mongoose.connection.syncIndexes();

    console.log("✅ MongoDB conectado:", MONGO_URI.split("@")[1]);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};
