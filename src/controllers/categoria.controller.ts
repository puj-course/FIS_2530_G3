import { Request, Response } from "express";
import Categoria from "../models/categoria.model";

export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    const cat = await Categoria.create({ nombre });
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ message: "Error al crear categoría", error: err.message });
  }
};

export const listarCategorias = async (_req: Request, res: Response) => {
  try {
    const cats = await Categoria.find().sort({ nombre: 1 });
    res.json(cats);
  } catch (err: any) {
    res.status(500).json({ message: "Error al listar categorías", error: err.message });
  }
};

export const obtenerCategoria = async (req: Request, res: Response) => {
  try {
    const cat = await Categoria.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ message: "Error al obtener categoría", error: err.message });
  }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  try {
    const cat = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ message: "Error al actualizar categoría", error: err.message });
  }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  try {
    const cat = await Categoria.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (err: any) {
    res.status(500).json({ message: "Error al eliminar categoría", error: err.message });
  }
};

// método de dominio: renombrar
export const renombrarCategoria = async (req: Request, res: Response) => {
  try {
    const { nuevo } = req.body;
    const cat = await Categoria.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Categoría no encontrada" });

    await cat.renombrar(nuevo);
    res.json({ message: "Categoría renombrada", categoria: cat });
  } catch (err: any) {
    res.status(500).json({ message: "Error al renombrar categoría", error: err.message });
  }
};
