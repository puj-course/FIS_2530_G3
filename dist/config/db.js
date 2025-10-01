"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "";
const connectDB = async () => {
    if (!MONGO_URI.startsWith("mongodb")) {
        throw new Error("MONGO_URI vacío o inválido. Revisa tu .env");
    }
    await mongoose_1.default.connect(MONGO_URI);
    console.log("✅ MongoDB conectado:", MONGO_URI.split("@")[1]);
};
exports.connectDB = connectDB;
