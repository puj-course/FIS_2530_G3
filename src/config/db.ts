import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async () => {
  if (!MONGO_URI.startsWith("mongodb")) {
    throw new Error("MONGO_URI vacío o inválido. Revisa tu .env");
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB conectado:", MONGO_URI.split("@")[1]); 
};
