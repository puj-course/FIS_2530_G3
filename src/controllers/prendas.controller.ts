// src/controllers/prendas.controller.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import { Prenda } from "../models/prenda.models"; // ⬅ ajusta la ruta/nombre si es necesario

const isObjectId = (id?: string) => !!id && Types.ObjectId.isValid(id);

/* ============================
 * LISTAR (con filtros simples)
 * ============================*/
export const listarPrendas = async (req: Request, res: Response) => {
  try {
    const { categoria, color, talla, page = "1", limit = "12" } = req.query as {
      categoria?: string;
      color?: string;
      talla?: string;
      page?: string;
      limit?: string;
    };

    const q: Record<string, any> = {};
    if (categoria) q.categoria = categoria;
    if (color) q.color = color;
    if (talla) q.talla = talla;

    const curPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.max(1, parseInt(limit, 10));
    const skip = (curPage - 1) * perPage;

    const [items, total] = await Promise.all([
      Prenda.find(q).sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Prenda.countDocuments(q),
    ]);

    return res.status(200).json({
      items,
      total,
      page: curPage,
      pages: Math.ceil(total / perPage),
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Error listando prendas", error: err.message });
  }
};

/* ============================
 * OBTENER POR ID
 * ============================*/
export const obtenerPrenda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!isObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const prenda = await Prenda.findById(id);
    if (!prenda) return res.status(404).json({ message: "Prenda no encontrada" });

    return res.status(200).json(prenda);
  } catch (err: any) {
    return res.status(500).json({ message: "Error obteniendo prenda", error: err.message });
  }
};

/* ============================
 * CREAR
 * ============================*/
export const crearPrenda = async (req: Request, res: Response) => {
  try {
    // Asegúrate de tener app.use(express.json()) en tu app/server
    const { nombre, talla, color, categoria, descripcion, fotos } = req.body as {
      nombre: string;
      talla?: string;
      color?: string;
      categoria?: string;
      descripcion?: string;
      fotos?: string[];
    };

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const prenda = await Prenda.create({
      nombre,
      talla,
      color,
      categoria,
      descripcion,
      fotos: Array.isArray(fotos) ? fotos : [],
    });

    // ✅ Responder siempre JSON para que REST Client pueda leer {{...response.body._id}}
    return res.status(201).json(prenda);
  } catch (err: any) {
    return res.status(500).json({ message: "Error creando prenda", error: err.message });
  }
};

/* ============================
 * ACTUALIZAR
 * ============================*/
export const actualizarPrenda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!isObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const { nombre, talla, color, categoria, descripcion, fotos } = req.body as {
      nombre?: string;
      talla?: string;
      color?: string;
      categoria?: string;
      descripcion?: string;
      fotos?: string[];
    };

    const update: Record<string, any> = {};
    if (typeof nombre === "string") update.nombre = nombre;
    if (typeof talla === "string") update.talla = talla;
    if (typeof color === "string") update.color = color;
    if (typeof categoria === "string") update.categoria = categoria;
    if (typeof descripcion === "string") update.descripcion = descripcion;
    if (Array.isArray(fotos)) update.fotos = fotos;

    const prenda = await Prenda.findByIdAndUpdate(id, update, { new: true });
    if (!prenda) return res.status(404).json({ message: "Prenda no encontrada" });

    return res.status(200).json(prenda);
  } catch (err: any) {
    return res.status(500).json({ message: "Error actualizando prenda", error: err.message });
  }
};

/* ============================
 * ELIMINAR
 * ============================*/
export const eliminarPrenda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!isObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const prenda = await Prenda.findByIdAndDelete(id);
    if (!prenda) return res.status(404).json({ message: "Prenda no encontrada" });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ message: "Error eliminando prenda", error: err.message });
  }
};
// ✅ Valida usando el método de instancia .esValida() del modelo
export const validarPrenda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!isObjectId(id)) return res.status(400).json({ message: "ID inválido" });

    const prenda = await Prenda.findById(id);
    if (!prenda) return res.status(404).json({ message: "Prenda no encontrada" });

    // si agregaste el método de instancia en el modelo (como te pasé)
    // PrendaSchema.methods.esValida = function(): boolean { ... }
    // @ts-ignore porque TS no “ve” métodos custom si no extendiste el tipo
    const ok = prenda.esValida ? prenda.esValida() : true;

    return res.status(200).json({ ok });
  } catch (err: any) {
    return res.status(500).json({ message: "Error validando prenda", error: err.message });
  }
};
