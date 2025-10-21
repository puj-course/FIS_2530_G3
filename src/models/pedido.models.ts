// src/models/pedido.model.ts
import mongoose, { Document, Model } from "mongoose";
import { ItemCarritoSchema, ItemCarritoDoc } from "./item-carrito.models";

export type PedidoEstado = "CREADO" | "PAGADO" | "ENVIADO" | "COMPLETADO" | "CANCELADO";

export interface PedidoAttrs {
  comprador: mongoose.Types.ObjectId;
  items: ItemCarritoDoc[];
  montoTotal: number;
  estado?: PedidoEstado;
  estrategia?: string; // nombre de la estrategia usada (p.ej. "tarjeta", "billetera", "sinPago")
}

export interface PedidoDoc extends Document {
  comprador: mongoose.Types.ObjectId;
  items: ItemCarritoDoc[];
  montoTotal: number;
  estado: PedidoEstado;
  estrategia?: string;
  marcarEnviado(): void;
  marcarCompletado(): void;
}

interface PedidoModel extends Model<PedidoDoc> {}

const PedidoSchema = new mongoose.Schema<PedidoDoc>(
  {
    comprador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    items: { type: [ItemCarritoSchema], required: true },
    montoTotal: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["CREADO", "PAGADO", "ENVIADO", "COMPLETADO", "CANCELADO"],
      default: "CREADO",
    },
    estrategia: { type: String },
  },
  { timestamps: true }
);

PedidoSchema.methods.marcarEnviado = function () {
  if (this.estado !== "PAGADO") throw new Error("No se puede enviar: pedido no pagado");
  this.estado = "ENVIADO";
};

PedidoSchema.methods.marcarCompletado = function () {
  if (this.estado !== "ENVIADO") throw new Error("No se puede completar: pedido no enviado");
  this.estado = "COMPLETADO";
};

export const Pedido = mongoose.model<PedidoDoc, PedidoModel>("Pedido", PedidoSchema);
