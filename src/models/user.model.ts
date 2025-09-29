import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 32, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  passwordHash: { type: String, required: true },
  roleId: { type: Types.ObjectId, ref: "Role", required: true },
  status: { type: String, enum: ["ACTIVE", "PENDING", "BANNED"], default: "ACTIVE" },
  lastLoginAt: { type: Date }
}, { timestamps: true });

export const User = model("User", userSchema);
