import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ecomoda";
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado:", uri);
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  }
}
