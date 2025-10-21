import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  Publicacion,
  PublicacionDoc,
  PublicacionDonacion,
  PublicacionIntercambio,
  PublicacionVenta,
} from "../models/publicacion.model";
import { Prenda } from "../models/prenda.models";

const isId = (id?: string) => !!id && Types.ObjectId.isValid(id);

/* ============================
 * Listar publicaciones
 * ============================*/
export const listarPublicaciones = async (req: Request, res: Response) => {
  try {
    const { tipo, estado, duenio, page = "1", limit = "12" } = req.query as {
      tipo?: "donacion" | "intercambio" | "venta";
      estado?: "activa" | "pausada" | "cerrada";
      duenio?: string;
      page?: string;
      limit?: string;
    };

    const q: Record<string, any> = {};
    if (tipo) q.tipo = tipo; // set por discriminator
    if (estado) q.estado = estado;
    if (duenio && isId(duenio)) q.duenio = duenio;

    const curPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.max(1, parseInt(limit, 10));
    const skip = (curPage - 1) * perPage;

    const [items, total] = await Promise.all([
      Publicacion.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("prenda")
        .populate("duenio", "nombre email"),
      Publicacion.countDocuments(q),
    ]);

    return res.status(200).json({
      items,
      total,
      page: curPage,
      pages: Math.ceil(total / perPage),
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error listando publicaciones", error: err.message });
  }
};

/* ============================
 * Obtener por ID
 * ============================*/
export const obtenerPublicacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });

    const pub = await Publicacion.findById(id)
      .populate("prenda")
      .populate("duenio", "nombre email");
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });

    return res.status(200).json(pub);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error obteniendo publicación", error: err.message });
  }
};

/* ============================
 * Crear publicación
 * ============================*/
export const crearPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const {
      prenda,
      tipo, // "venta" | "donacion" | "intercambio"
      precio,
      estado = "activa",
      fotos = [],
      stock,
    } = req.body as {
      prenda: string;
      tipo: "venta" | "donacion" | "intercambio";
      precio?: number;
      estado?: "activa" | "pausada" | "cerrada";
      fotos?: string[];
      stock?: number;
    };

    if (!isId(prenda)) return res.status(400).json({ message: "Prenda inválida" });

    const prendaDoc = await Prenda.findById(prenda);
    if (!prendaDoc) return res.status(404).json({ message: "Prenda no encontrada" });

    let pubDoc: PublicacionDoc | null = null;

    if (tipo === "venta") {
      if (typeof precio !== "number" || precio < 0) {
        return res.status(400).json({ message: "Precio inválido para venta" });
      }
      pubDoc = await PublicacionVenta.create({
        prenda,
        duenio: userId,
        precio,
        estado,
        fotos,
        seguidores: [],
        stock,
      });
    } else if (tipo === "donacion") {
      pubDoc = await PublicacionDonacion.create({
        prenda,
        duenio: userId,
        precio: 0,
        estado,
        fotos,
        seguidores: [],
      });
    } else if (tipo === "intercambio") {
      pubDoc = await PublicacionIntercambio.create({
        prenda,
        duenio: userId,
        precio: 0,
        estado,
        fotos,
        seguidores: [],
      });
    } else {
      return res.status(400).json({ message: "Tipo de publicación inválido" });
    }

    return res.status(201).json(pubDoc);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error creando publicación", error: err.message });
  }
};

/* ============================
 * Actualizar publicación (solo dueño)
 * ============================*/
export const actualizarPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const { id } = req.params as { id: string };
    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });

    const pub = await Publicacion.findById(id);
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });
    if (String(pub.duenio) !== String(userId)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const { precio, fotos, estado, stock } = req.body as {
      precio?: number;
      fotos?: string[];
      estado?: "activa" | "pausada" | "cerrada";
      stock?: number;
    };

    if (typeof precio === "number") pub.precio = Math.max(0, precio);
    if (Array.isArray(fotos)) pub.fotos = fotos;
    if (estado && ["activa", "pausada", "cerrada"].includes(estado)) pub.estado = estado;

    // Si es de tipo venta, podemos tocar stock
    // @ts-ignore - leer discriminator
    if ((pub as any).tipo === "venta" && typeof stock === "number" && stock >= 0) {
      // @ts-ignore
      (pub as any).stock = stock;
    }

    await pub.save();
    return res.status(200).json(pub);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error actualizando publicación", error: err.message });
  }
};

/* ============================
 * Eliminar publicación (solo dueño)
 * ============================*/
export const eliminarPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const { id } = req.params as { id: string };
    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });

    const pub = await Publicacion.findById(id);
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });
    if (String(pub.duenio) !== String(userId)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Publicacion.findByIdAndDelete(id);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error eliminando publicación", error: err.message });
  }
};

/* ============================
 * Seguir / Dejar de seguir
 * ============================*/
export const seguirPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const { id } = req.params as { id: string };
    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });

    const pub = await Publicacion.findByIdAndUpdate(
      id,
      { $addToSet: { seguidores: userId } },
      { new: true }
    );
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });

    return res.status(200).json(pub);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error al seguir publicación", error: err.message });
  }
};

export const dejarSeguirPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const { id } = req.params as { id: string };
    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });

    const pub = await Publicacion.findByIdAndUpdate(
      id,
      { $pull: { seguidores: userId } },
      { new: true }
    );
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });

    return res.status(200).json(pub);
  } catch (err: any) {
    return res.status(500).json({
      message: "Error al dejar de seguir publicación",
      error: err.message,
    });
  }
};

/* ============================
 * Cambiar estado (solo dueño)
 * ============================*/
export const cambiarEstadoPublicacion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const { id } = req.params as { id: string };
    const { estado } = req.body as { estado: "activa" | "pausada" | "cerrada" };

    if (!isId(id)) return res.status(400).json({ message: "ID inválido" });
    if (!estado || !["activa", "pausada", "cerrada"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const pub = await Publicacion.findById(id);
    if (!pub) return res.status(404).json({ message: "Publicación no encontrada" });
    if (String(pub.duenio) !== String(userId)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    pub.estado = estado;
    await pub.save();
    return res.status(200).json(pub);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Error cambiando estado", error: err.message });
  }
};