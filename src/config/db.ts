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

<<<<<<< HEAD
    // 🔹 Sincroniza índices de todos los modelos declarados (opcional pero recomendado)
=======
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
    await mongoose.connection.syncIndexes();

    console.log("✅ MongoDB conectado:", MONGO_URI.split("@")[1]);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};
