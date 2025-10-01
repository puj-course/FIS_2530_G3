"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(32).trim().required(),
    email: joi_1.default.string().email().trim().required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid("ADMIN", "USER").default("USER")
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().trim().required(),
    password: joi_1.default.string().min(8).required()
});
