"use strict";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// import { Role } from "./models/role.model";
// import { User } from "./models/user.model";
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecomoda";
// async function main() {
//   try {
//     await mongoose.connect(MONGO_URI, { dbName: "ecomoda" });
//     console.log("✅ MongoDB conectado:", MONGO_URI);
//     // sincroniza índices (en dev)
//     await Role.syncIndexes();
//     await User.syncIndexes();
//     await testModels(); // ← Solo después de conectar
//   } catch (err) {
//     console.error("❌ Error de arranque:", err);
//     process.exit(1);
//   }
// }
// async function testModels() {
//   // crea rol USER si no existe
//   let role = await Role.findOne({ name: "USER" });
//   if (!role) {
//     role = await Role.create({ name: "USER" });
//     console.log("✅ Rol creado:", role.name);
//   }
//   // crea un usuario de prueba
//   const u = await User.create({
//     username: "prueba1",
//     email: "prueba1@example.com",
//     passwordHash: "demo", // (en la sub-issue 2 la encriptamos)
//     roleId: role._id
//   });
//   console.log("✅ Usuario creado:", u.username, u.email);
// }
// main();
