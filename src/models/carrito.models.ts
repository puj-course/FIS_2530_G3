import mongoose, { Document, Model } from "mongoose";
import { ItemCarritoDoc, ItemCarritoSchema } from "./item-carrito.models";
import { PublicacionVenta } from "./publicacion-venta.models"; // ajusta la ruta si difiere

export interface CarritoAttrs {
  usuario: mongoose.Types.ObjectId;
}

export interface CarritoDoc extends Document {
  usuario: mongoose.Types.ObjectId;
  items: ItemCarritoDoc[];
  total: number;
  agregar(pubId: mongoose.Types.ObjectId, cantidad: number): Promise<void>;
  quitar(pubId: mongoose.Types.ObjectId): void;
  calcularTotal(): Promise<number>;
}

interface CarritoModel extends Model<CarritoDoc> {}

const CarritoSchema = new mongoose.Schema<CarritoDoc>(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, unique: true },
    items: { type: [ItemCarritoSchema], default: [] },
    total: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

CarritoSchema.methods.agregar = async function (
  this: CarritoDoc,
  pubId: mongoose.Types.ObjectId,
  cantidad: number
): Promise<void> {
  const existente = this.items.find(
    (i: ItemCarritoDoc) => i.publicacion.toString() === pubId.toString()
  );

  const pub = await PublicacionVenta.findById(pubId).select("precio estado");
  if (!pub) throw new Error("Publicación no encontrada");
  if ((pub.get("estado") as string) !== "activa") throw new Error("Publicación no disponible");

  const precio = Number(pub.get("precio"));

  if (existente) {
    existente.cantidad += cantidad;
    existente.recalcular(precio);
  } else {
    this.items.push({
      publicacion: pubId,
      cantidad,
      subtotal: precio * cantidad,
    } as any);
  }

  await this.calcularTotal();
};

CarritoSchema.methods.quitar = function (this: CarritoDoc, pubId: mongoose.Types.ObjectId): void {
  this.items = this.items.filter(
    (i: ItemCarritoDoc) => i.publicacion.toString() !== pubId.toString()
  );
};

CarritoSchema.methods.calcularTotal = async function (this: CarritoDoc): Promise<number> {
  for (const item of this.items) {
    const pub = await PublicacionVenta.findById(item.publicacion).select("precio");
    if (pub) item.recalcular(Number(pub.get("precio")));
  }

  this.total = this.items.reduce(
    (acc: number, it: ItemCarritoDoc) => acc + (Number(it.subtotal) || 0),
    0
  );
  return this.total;
};

export const Carrito = mongoose.model<CarritoDoc, CarritoModel>("Carrito", CarritoSchema);
export default Carrito;
