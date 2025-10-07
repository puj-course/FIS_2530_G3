import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true }
}, { timestamps: true });

export default model("User", userSchema);