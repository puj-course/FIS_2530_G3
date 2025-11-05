// src/models/item-carrito.model.ts
import mongoose, { Document } from "mongoose";

export interface ItemCarritoAttrs {
  publicacion: mongoose.Types.ObjectId; // ref PublicacionVenta
  cantidad: number;
  subtotal?: number; // se recalcula
}

export interface ItemCarritoDoc extends Document {
  publicacion: mongoose.Types.ObjectId;
  cantidad: number;
  subtotal: number;
  recalcular(precioActual: number): void;
}

export const ItemCarritoSchema = new mongoose.Schema<ItemCarritoDoc>(
  {
    publicacion: { type: mongoose.Schema.Types.ObjectId, ref: "PublicacionVenta", required: true },
    cantidad: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

ItemCarritoSchema.methods.recalcular = function (precioActual: number) {
  this.subtotal = Math.max(0, Number(precioActual) * Number(this.cantidad));
};
