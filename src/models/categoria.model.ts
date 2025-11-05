import { Schema, model, Document } from "mongoose";

export interface ICategoria extends Document {
  nombre: string;
  renombrar(nuevo: string): Promise<void>;
}

const categoriaSchema = new Schema<ICategoria>(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

// método de dominio del diagrama
categoriaSchema.methods.renombrar = async function (nuevo: string) {
  this.nombre = nuevo.trim();
  await this.save();
};

export default model<ICategoria>("Categoria", categoriaSchema);
