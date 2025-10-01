"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const rounds = Number(process.env.BCRYPT_ROUNDS || 11);
async function hashPassword(plain) {
    return bcrypt_1.default.hash(plain, rounds);
}
async function comparePassword(plain, hash) {
    return bcrypt_1.default.compare(plain, hash);
}
