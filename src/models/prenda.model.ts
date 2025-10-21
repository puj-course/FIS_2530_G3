import mongoose, { Schema, Document, Model, models } from "mongoose";

/** ========= Tipos ========= */
export interface PrendaAttrs {
  nombre: string;
  talla?: string;
  color?: string;
  categoria?: string;     // texto; si luego usas ref cambia a ObjectId
  descripcion?: string;
  fotos?: string[];
}

export interface PrendaDoc extends Document, PrendaAttrs {
  createdAt?: Date;
  updatedAt?: Date;

  // ✅ método de instancia que tu controlador está usando
  esValida(): boolean;
}

export type PrendaModel = Model<PrendaDoc>;

/** ========= Esquema ========= */
const PrendaSchema = new Schema<PrendaDoc>(
  {
    nombre: { type: String, required: true, trim: true },
    talla: { type: String, trim: true },
    color: { type: String, trim: true },
    categoria: { type: String, trim: true },
    descripcion: { type: String, trim: true },
    fotos: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Índices útiles
PrendaSchema.index({ nombre: 1, categoria: 1 });

/** ========= Métodos de instancia ========= */
PrendaSchema.methods.esValida = function (): boolean {
  // valida mínimo que 'nombre' exista y que las cadenas no excedan tamaños típicos
  const okNombre = typeof this.nombre === "string" && this.nombre.trim().length > 0;
  const okTalla = this.talla ? this.talla.length <= 15 : true;
  const okColor = this.color ? this.color.length <= 30 : true;
  const okCategoria = this.categoria ? this.categoria.length <= 60 : true;
  return okNombre && okTalla && okColor && okCategoria;
};

/** ========= Modelo ========= */
export const Prenda: PrendaModel =
  (models.Prenda as PrendaModel) ||
  mongoose.model<PrendaDoc, PrendaModel>("Prenda", PrendaSchema);

export default Prenda;
