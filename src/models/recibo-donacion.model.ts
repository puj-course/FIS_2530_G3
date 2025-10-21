import { Schema, model, models, Types, Model, HydratedDocument } from 'mongoose';

/** ───────── Types ───────── */
export interface IReciboDonacionBase {
  _id: Types.ObjectId;
  donante: Types.ObjectId;     // ref: Usuario
  publicacion: Types.ObjectId; // ref: Publicacion (Donacion)
  fecha: Date;
  numero: string;              // folio
}

export interface IReciboDonacionMethods {
  generarPDF(): Promise<Buffer>;
}

export type IReciboDonacion = HydratedDocument<IReciboDonacionBase, IReciboDonacionMethods>;
type ReciboDonacionModel = Model<IReciboDonacionBase, {}, IReciboDonacionMethods>;

/** ───────── Schema ───────── */
const ReciboDonacionSchema = new Schema<IReciboDonacionBase, ReciboDonacionModel, IReciboDonacionMethods>(
  {
    donante: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    publicacion: { type: Schema.Types.ObjectId, ref: 'Publicacion', required: true },
    fecha: { type: Date, default: () => new Date() },
    numero: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Stub de PDF
ReciboDonacionSchema.methods.generarPDF = async function (): Promise<Buffer> {
  const contenido = RECIBO ${this.numero} - ${this.fecha.toISOString()};
  return Buffer.from(contenido, 'utf8');
};

/** ───────── Model (con cache) ───────── */
export const ReciboDonacion: ReciboDonacionModel =
  (models.ReciboDonacion as ReciboDonacionModel) ||
  model<IReciboDonacionBase, ReciboDonacionModel>('ReciboDonacion', ReciboDonacionSchema);

export default ReciboDonacion;