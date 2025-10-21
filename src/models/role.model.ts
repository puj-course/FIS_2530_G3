import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  name: { type: String, enum: ["ADMIN", "USER"], unique: true, required: true }
});

export default model("Role", roleSchema);

