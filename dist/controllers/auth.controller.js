"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
exports.register = register;
exports.login = login;
exports.me = me;
exports.getUsers = getUsers;
const auth_schema_1 = require("../validators/auth.schema");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
/**
 * POST /auth/register
 * Crea un usuario con password hasheado y rol (por defecto USER).
 */
async function register(req, res) {
    try {
        // Validación del payload (elimina campos no permitidos)
        const { value, error } = auth_schema_1.registerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                message: "Validación fallida",
                details: error.details.map((d) => d.message),
            });
        }
        const { username, email, password, role } = value;
        // Duplicados por email o username
        const exists = await user_model_1.User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(400).json({ message: "Email o username ya está en uso" });
        }
        // Resolver rol (crearlo si no existe en dev)
        const roleName = role ?? "USER";
        let roleDoc = await role_model_1.Role.findOne({ name: roleName });
        if (!roleDoc) {
            roleDoc = await role_model_1.Role.create({ name: roleName });
        }
        // Hash de contraseña
        const passwordHash = await (0, hash_1.hashPassword)(password);
        // Crear usuario
        const user = await user_model_1.User.create({
            username,
            email,
            passwordHash,
            roleId: roleDoc._id,
            status: "ACTIVE",
        });
        // Respuesta sin passwordHash
        return res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: roleDoc.name,
            status: user.status,
            createdAt: user.createdAt,
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/register:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
/**
 * POST /auth/login
 * Verifica credenciales y devuelve JWT.
 */
async function login(req, res) {
    try {
        const { value, error } = auth_schema_1.loginSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                message: "Validación fallida",
                details: error.details.map((d) => d.message),
            });
        }
        const { email, password } = value;
        // Buscar usuario por email
        const user = await user_model_1.User.findOne({ email }).populate("roleId");
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // Comparar contraseña
        const ok = await (0, hash_1.comparePassword)(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // Firmar JWT
        const payload = {
            sub: String(user._id),
            username: user.username,
            role: user.roleId?.name ?? "USER",
        };
        const token = (0, jwt_1.signJwt)(payload);
        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: payload.role,
            },
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/login:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
/**
 * GET /auth/me
 * Devuelve info básica del usuario autenticado (payload del JWT o consulta a DB).
 * Requiere el middleware `auth` que inyecta `req.user`.
 */
async function me(req, res) {
    try {
        const payload = req.user;
        if (!payload)
            return res.status(401).json({ message: "No autenticado" });
        // Si prefieres devolver datos desde DB:
        // const user = await User.findById(payload.sub)
        //   .select("_id username email")
        //   .lean();
        // return res.json({ user });
        // Para respuesta rápida con lo que viene en el token:
        return res.json({
            user: {
                id: payload.sub,
                username: payload.username,
                role: payload.role,
            },
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/me:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
const jwt_2 = require("../utils/jwt");
/** Helper: parsea Authorization: Bearer <token> */
function getTokenFromHeader(req) {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");
    if (!type || type.toLowerCase() !== "bearer" || !token)
        return null;
    return token;
}
/* ===========================================================
 * REGISTER  (POST /auth/register)
 * =========================================================== */
async function register(req, res) {
    try {
        const result = auth_schema_1.registerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (result.error) {
            return res.status(400).json({
                message: "Validación fallida",
                details: result.error.details.map((d) => d.message),
            });
        }
        if (!result.value) {
            return res.status(400).json({ message: "Cuerpo vacío o JSON inválido" });
        }
        const { username, email, password, role } = result.value;
        // Verificaciones de unicidad
        const existsUsername = await user_model_1.User.exists({ username });
        if (existsUsername) {
            return res.status(409).json({ message: "El username ya está en uso" });
        }
        const existsEmail = await user_model_1.User.exists({ email });
        if (existsEmail) {
            return res.status(409).json({ message: "El email ya está en uso" });
        }
        // (Opcional) si usas colección de roles, valida que exista
        if (role) {
            const validRoles = ["ADMIN", "USER"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Rol inválido" });
            }
            // Si tu modelo usa roleId (referencia), puedes resolverlo aquí:
            // const roleDoc = await Role.findOne({ name: role });
            // if (!roleDoc) return res.status(400).json({ message: "Rol inexistente" });
        }
        const passwordHash = await (0, hash_1.hashPassword)(password);
        const user = await user_model_1.User.create({
            username,
            email,
            password: passwordHash,
            role: role ?? "USER",
            status: "ACTIVE",
        });
        return res.status(201).json({
            id: String(user._id),
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/register:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
/* ===========================================================
 * LOGIN  (POST /auth/login)
 * =========================================================== */
async function login(req, res) {
    try {
        const result = auth_schema_1.loginSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (result.error) {
            return res.status(400).json({
                message: "Validación fallida",
                details: result.error.details.map((d) => d.message),
            });
        }
        if (!result.value) {
            return res.status(400).json({ message: "Cuerpo vacío o JSON inválido" });
        }
        const { email, password } = result.value;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const ok = await (0, hash_1.comparePassword)(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const token = (0, jwt_1.signJwt)({
            sub: String(user._id),
            username: user.username,
            role: user.role,
        });
        return res.json({
            token,
            user: {
                id: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/login:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
/* ===========================================================
 * ME  (GET /auth/me)
 *   - Devuelve info del usuario autenticado a partir del token
 * =========================================================== */
async function me(req, res) {
    try {
        // Si tienes middleware que setea req.user, úsalo.
        // Si no, verificamos el token aquí (fallback):
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).json({ message: "Token requerido" });
        }
        const payload = (0, jwt_2.verifyJwt)(token);
        if (!payload) {
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
        const user = await user_model_1.User.findById(payload.sub, { password: 0, __v: 0 }).lean();
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json({
            id: String(user._id),
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
        });
    }
    catch (err) {
        console.error("❌ Error en /auth/me:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
/* ===========================================================
 * GET USERS  (GET /auth/users)  — Sub-issue #56
 *   - Paginado simple y sin contraseña
 * =========================================================== */
async function getUsers(req, res) {
    try {
        const page = Math.max(parseInt(String(req.query.page ?? "1"), 10), 1);
        const limit = Math.max(parseInt(String(req.query.limit ?? "20"), 10), 1);
        const skip = (page - 1) * limit;
        const [total, users] = await Promise.all([
            user_model_1.User.countDocuments({}),
            user_model_1.User.find({}, { password: 0, __v: 0 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);
        const data = users.map((u) => ({
            id: String(u._id),
            username: u.username,
            email: u.email,
            role: u.role,
            status: u.status,
            createdAt: u.createdAt,
        }));
        return res.json({
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit) || 1,
            },
            data,
        });
    }
    catch (err) {
        console.error("❌ Error en getUsers:", err);
        return res.status(500).json({ message: "Error interno" });
    }
}
