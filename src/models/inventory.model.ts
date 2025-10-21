import { Schema, model, Types, Document } from "mongoose";

export interface InventoryDoc extends Document {
  productName: string;
  category: string;
  quantity: number;
  price: number;
  supplier?: string;
  adminId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<InventoryDoc>(
  {
    productName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    supplier: { type: String, trim: true },
    // 🔗 Relación con usuario administrador
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice compuesto para mejorar consultas por admin y producto
InventorySchema.index({ adminId: 1, productName: 1 });

export const InventoryModel = model<InventoryDoc>("Inventory", InventorySchema);
