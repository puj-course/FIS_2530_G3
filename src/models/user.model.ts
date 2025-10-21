import { Schema, model } from "mongoose";
import { InventoryModel } from "./inventory.model.js"; // ⚠️ Ajusta ruta si tu estructura es distinta

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  },
  { timestamps: true }
);

// 🧹 Middleware: simula ON DELETE CASCADE
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    // Eliminar todos los inventarios del admin borrado
    await InventoryModel.deleteMany({ adminId: user._id });
  }
  next();
});

export default model("User", userSchema);
