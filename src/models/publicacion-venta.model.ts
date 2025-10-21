import { Model, Schema } from "mongoose";
import { Publicacion, PublicacionDoc } from "./publicacion.model";

export interface PublicacionVentaDoc extends PublicacionDoc {
  stock?: number;
}
export interface PublicacionVentaModel extends Model<PublicacionVentaDoc> {}

const PublicacionVentaSchema = new Schema<PublicacionVentaDoc>(
  { stock: { type: Number, default: 1, min: 0 } },
  { timestamps: true }
);

export const PublicacionVenta =
  (Publicacion.discriminators?.PublicacionVenta as PublicacionVentaModel) ||
  Publicacion.discriminator<PublicacionVentaDoc, PublicacionVentaModel>(
    "PublicacionVenta",
    PublicacionVentaSchema
  );

export default PublicacionVenta;