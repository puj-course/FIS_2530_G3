import { Request, Response } from "express";
import { NotificationFacade } from "./services/notifications/NotificationFacade";

/**
 * Ruta temporal: /api/auth/test-sms
 * Envía un SMS de prueba SIN guardar usuario en base de datos.
 */
export const testSms = async (req: Request, res: Response) => {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ ok: false, message: "nombre y email son obligatorios" });
    }

    await NotificationFacade.getInstancia().userCreated({
      id: "TEST_" + Math.floor(Math.random() * 10000),
      nombre,
      email,
      telefono,
    });

    return res.status(200).json({
      ok: true,
      message: "SMS de prueba enviado correctamente (sin guardar en BD)",
    });
  } catch (error: any) {
    console.error("[test-sms] Error:", error.message);
    return res.status(500).json({ ok: false, message: error.message || "Error enviando SMS" });
  }
};
