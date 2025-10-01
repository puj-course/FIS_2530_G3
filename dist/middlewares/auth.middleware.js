"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function auth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const [scheme, token] = header.split(" ");
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ message: "Token requerido" });
        }
        const payload = (0, jwt_1.verifyJwt)(token);
        // guarda el payload para siguientes handlers
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}
// Guard para roles específicos
function requireRole(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "No autenticado" });
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "No autorizado" });
        }
        next();
    };
}
