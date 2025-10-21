import { Schema, model, models, Types, Model, HydratedDocument } from 'mongoose';

/* =========================
 * Tipos e interfaces
 * ========================= */
export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada';

export interface ISolicitudIntercambioBase {
  _id: Types.ObjectId;
  ofertante: Types.ObjectId;           // ref: Usuario
  publicacionObjetivo: Types.ObjectId; // ref: PublicacionIntercambio
  descripcionOferta: string;
  estado: EstadoSolicitud;
}

export interface ISolicitudIntercambioMethods {
  aceptar(): void;
  rechazar(): void;
}

export type ISolicitudIntercambio = HydratedDocument<
  ISolicitudIntercambioBase,
  ISolicitudIntercambioMethods
>;

type SolicitudIntercambioModel = Model<
  ISolicitudIntercambioBase,
  {},
  ISolicitudIntercambioMethods
>;

/* =========================
 * Schema
 * ========================= */
const SolicitudIntercambioSchema = new Schema<
  ISolicitudIntercambioBase,
  SolicitudIntercambioModel,
  ISolicitudIntercambioMethods
>(
  {
    ofertante: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    publicacionObjetivo: {
      type: Schema.Types.ObjectId,
      ref: 'Publicacion',
      required: true,
    },
    descripcionOferta: { type: String, default: '' },
    estado: {
      type: String,
      enum: ['pendiente', 'aceptada', 'rechazada'],
      default: 'pendiente',
    },
  },
  { timestamps: true, versionKey: false }
);

/* =========================
 * Métodos
 * ========================= */
SolicitudIntercambioSchema.methods.aceptar = function (): void {
  this.estado = 'aceptada';
};

SolicitudIntercambioSchema.methods.rechazar = function (): void {
  this.estado = 'rechazada';
};

/* =========================
 * Modelo con cache
 * ========================= */
export const SolicitudIntercambio: SolicitudIntercambioModel =
  (models.SolicitudIntercambio as SolicitudIntercambioModel) ||
  model<ISolicitudIntercambioBase, SolicitudIntercambioModel>(
    'SolicitudIntercambio',
    SolicitudIntercambioSchema
  );

export default SolicitudIntercambio;
