import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  name: { type: String, enum: ["ADMIN", "USER"], required: true, unique: true }
}, { timestamps: true });

export const Role = model("Role", roleSchema);
