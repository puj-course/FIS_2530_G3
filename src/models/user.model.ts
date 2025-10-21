import {
  Schema,
  model,
  models,
  Types,
  Model,
  HydratedDocument,
  Document,
} from 'mongoose';

export type RolUsuario = 'usuario' | 'admin';

/* =========================
 * Interfaces y tipos
 * ========================= */
export interface IUsuarioBase {
  _id: Types.ObjectId;
  nombre: string;
  email: string;
  password: string;              // hash
  direccion?: string;
  rol: RolUsuario;

  // Relaciones
  seguimientos: Types.ObjectId[]; // Publicaciones que sigue
}

export interface IUsuarioMethods {
  seguirPublicacion(pubId: Types.ObjectId | string): Promise<void>;
  dejarSeguirPublicacion(pubId: Types.ObjectId | string): Promise<void>;
  recibirNotificacion(mensaje: string): string;
}

export type IUsuario = HydratedDocument<IUsuarioBase, IUsuarioMethods>;

// Modelo con métodos
type UsuarioModel = Model<IUsuarioBase, {}, IUsuarioMethods>;

/* =========================
 * Schema
 * ========================= */
const UsuarioSchema = new Schema<IUsuarioBase, UsuarioModel, IUsuarioMethods>(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    direccion: { type: String, default: '' },
    rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },

    seguimientos: [
      { type: Schema.Types.ObjectId, ref: 'Publicacion', default: [] },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================
 * Hooks
 * ========================= */
UsuarioSchema.pre('save', function (next) {
  if (this.isModified('email') && typeof this.email === 'string') {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

/* =========================
 * Métodos de dominio
 * ========================= */
UsuarioSchema.methods.seguirPublicacion = async function (
  pubId: Types.ObjectId | string
): Promise<void> {
  const id =
    typeof pubId === 'string' ? new Types.ObjectId(pubId) : (pubId as Types.ObjectId);

  const yaSigue = this.seguimientos.some((p: Types.ObjectId) => p.equals(id));
  if (!yaSigue) {
    this.seguimientos.push(id);
    await this.save();
  }
};

UsuarioSchema.methods.dejarSeguirPublicacion = async function (
  pubId: Types.ObjectId | string
): Promise<void> {
  const id =
    typeof pubId === 'string' ? new Types.ObjectId(pubId) : (pubId as Types.ObjectId);

  this.seguimientos = this.seguimientos.filter(
    (p: Types.ObjectId) => !p.equals(id)
  );
  await this.save();
};

UsuarioSchema.methods.recibirNotificacion = function (mensaje: string): string {
  // En el futuro: persistir notificación o enviar email/push
  return mensaje;
};

/* =========================
 * Modelo (con cache)
 * ========================= */
export const Usuario: UsuarioModel =
  (models.Usuario as UsuarioModel) ||
  model<IUsuarioBase, UsuarioModel>('Usuario', UsuarioSchema);

export default Usuario;
