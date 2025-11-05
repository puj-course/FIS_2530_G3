"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 API escuchando en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
};
startServer();
