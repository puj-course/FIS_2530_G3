"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => (0, auth_controller_1.register)(req, res).catch((err) => {
    console.error("❌ Error en /auth/register:", err);
    res.status(500).json({ message: "Error interno" });
}));
router.post("/login", (req, res) => (0, auth_controller_1.login)(req, res).catch((err) => {
    console.error("❌ Error en /auth/login:", err);
    res.status(500).json({ message: "Error interno" });
}));
router.get("/me", auth_middleware_1.auth, (req, res) => (0, auth_controller_1.me)(req, res).catch((err) => {
    console.error("❌ Error en /auth/me:", err);
    res.status(500).json({ message: "Error interno" });
}));
router.get("/admin/ping", auth_middleware_1.auth, (0, auth_middleware_1.requireRole)("ADMIN"), (_req, res) => {
    res.json({ ok: true, msg: "Hola ADMIN 👋" });
});
exports.default = router;
