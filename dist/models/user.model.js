"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 32, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    passwordHash: { type: String, required: true },
    roleId: { type: mongoose_1.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, enum: ["ACTIVE", "PENDING", "BANNED"], default: "ACTIVE" },
    lastLoginAt: { type: Date }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
