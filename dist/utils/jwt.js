"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET ?? "change-me";
const EXPIRES_IN = process.env.JWT_EXPIRES ?? "1d";
function signJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}
function verifyJwt(token) {
    return jsonwebtoken_1.default.verify(token, SECRET);
}
