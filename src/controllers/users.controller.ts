// src/controllers/users.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";
import Publicacion from "../models/publicacion.model"; 
import { Types } from "mongoose";

// Crear nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const { nombre, email, direccion, passwordHash, roleId, username } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const user = new User({
      nombre,
      email,
      direccion,
      passwordHash,
      roleId,
      username,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario.", error: error.message });
  }
};

// Obtener todos los usuarios
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().populate("roleId", "nombre");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener usuarios.", error: error.message });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate("roleId", "nombre");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Error al buscar usuario.", error: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado." });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar usuario.", error: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado." });
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar usuario.", error: error.message });
  }
};

// ------------------------ FUNCIONALIDADES DEL DIAGRAMA ------------------------

// Seguir una publicación
export const seguirPublicacion = async (req: Request, res: Response) => {
  try {
    const { id, pubId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const pubObjectId = new Types.ObjectId(pubId);
    await user.seguirPublicacion(pubObjectId);

    // (Opcional) Agregar usuario como seguidor en la publicación
    if (Publicacion) {
      await Publicacion.findByIdAndUpdate(pubId, { $addToSet: { seguidores: user._id } });
    }

    res.json({ message: "Publicación seguida correctamente." });
  } catch (error: any) {
    res.status(500).json({ message: "Error al seguir publicación.", error: error.message });
  }
};

// Dejar de seguir una publicación
export const dejarSeguirPublicacion = async (req: Request, res: Response) => {
  try {
    const { id, pubId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const pubObjectId = new Types.ObjectId(pubId);
    await user.dejarSeguirPublicacion(pubObjectId);

    if (Publicacion) {
      await Publicacion.findByIdAndUpdate(pubId, { $pull: { seguidores: user._id } });
    }

    res.json({ message: "Dejó de seguir la publicación." });
  } catch (error: any) {
    res.status(500).json({ message: "Error al dejar de seguir publicación.", error: error.message });
  }
};

// Enviar una notificación
export const enviarNotificacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    await user.recibirNotificacion(mensaje);
    res.json({ message: "Notificación enviada correctamente." });
  } catch (error: any) {
    res.status(500).json({ message: "Error al enviar notificación.", error: error.message });
  }
};
