import mongoose, { Schema, Model, Document, models } from "mongoose";

/* ==============================
 * Tipos
 * ============================== */
export type TipoPublicacion = "donacion" | "intercambio" | "venta";
export type EstadoPublicacion = "activa" | "pausada" | "cerrada";

/* ==============================
 * Interfaces base
 * ============================== */
export interface IPublicacionBase {
  prenda: mongoose.Types.ObjectId;     // ref: Prenda
  duenio: mongoose.Types.ObjectId;     // ref: Usuario
  precio: number;                      // en donación/intercambio puede ser 0
  tipo: TipoPublicacion;               // <- discriminatorKey
  estado: EstadoPublicacion;
  fotos?: string[];
  seguidores?: mongoose.Types.ObjectId[]; // ref: Usuario
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublicacionDoc extends Document, IPublicacionBase {}
export type PublicacionModel = Model<PublicacionDoc>;

/* ==============================
 * Esquema base
 * ============================== */
const PublicacionSchema = new Schema<PublicacionDoc>(
  {
    prenda: { type: Schema.Types.ObjectId, ref: "Prenda", required: true },
    duenio: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
    precio: { type: Number, required: true, min: 0, default: 0 },
    estado: { type: String, required: true, enum: ["activa", "pausada", "cerrada"], default: "activa" },
    fotos: [{ type: String }],
    seguidores: { type: [Schema.Types.ObjectId], ref: "Usuario", default: [] },
  },
  {
    timestamps: true,
    discriminatorKey: "tipo",       // 👈 solo aquí; NO declares 'tipo' como path
  }
);


// Índices recomendados
PublicacionSchema.index({ tipo: 1, estado: 1 });
PublicacionSchema.index({ duenio: 1, createdAt: -1 });

/* (opcional) helper de instancia de ejemplo */
PublicacionSchema.methods = {
  ...(PublicacionSchema.methods || {}),
  cambiarPrecio(this: PublicacionDoc, nuevo: number) {
    if (nuevo < 0) throw new Error("El precio no puede ser negativo");
    this.precio = nuevo;
  },
};

/* ==============================
 * Modelo base
 * ============================== */
export const Publicacion: PublicacionModel =
  (models.Publicacion as PublicacionModel) ||
  mongoose.model<PublicacionDoc, PublicacionModel>("Publicacion", PublicacionSchema);

/* ========================================================================
 * Discriminators
 * (si prefieres separarlos en archivos distintos, puedes, pero aquí quedan
 * listos para usar sin importar orden de importación)
 * ===================================================================== */

/** --------- Donación --------- */
export interface IPublicacionDonacion extends IPublicacionBase {}
export type PublicacionDonacionModel = Model<IPublicacionDonacion>;

const PublicacionDonacionSchema = new Schema<IPublicacionDonacion>({}, { timestamps: true });

export const PublicacionDonacion: PublicacionDonacionModel =
  (Publicacion.discriminators?.PublicacionDonacion as PublicacionDonacionModel) ||
  Publicacion.discriminator<IPublicacionDonacion>(
    "PublicacionDonacion",
    PublicacionDonacionSchema
  );

/** --------- Intercambio --------- */
export interface IPublicacionIntercambio extends IPublicacionBase {}
export type PublicacionIntercambioModel = Model<IPublicacionIntercambio>;

const PublicacionIntercambioSchema = new Schema<IPublicacionIntercambio>({}, { timestamps: true });

export const PublicacionIntercambio: PublicacionIntercambioModel =
  (Publicacion.discriminators?.PublicacionIntercambio as PublicacionIntercambioModel) ||
  Publicacion.discriminator<IPublicacionIntercambio>(
    "PublicacionIntercambio",
    PublicacionIntercambioSchema
  );

/** --------- Venta --------- */
export interface IPublicacionVenta extends IPublicacionBase {
  stock?: number; // opcional; por defecto 1
}
export type PublicacionVentaModel = Model<IPublicacionVenta>;

const PublicacionVentaSchema = new Schema<IPublicacionVenta>(
  { stock: { type: Number, default: 1, min: 0 } },
  { timestamps: true }
);

export const PublicacionVenta: PublicacionVentaModel =
  (Publicacion.discriminators?.PublicacionVenta as PublicacionVentaModel) ||
  Publicacion.discriminator<IPublicacionVenta>("PublicacionVenta", PublicacionVentaSchema);

export default Publicacion;
