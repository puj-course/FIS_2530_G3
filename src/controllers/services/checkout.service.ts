// src/controllers/services/checkout.service.ts
import mongoose from "mongoose";
import { Carrito } from "../../models/carrito.models";
import { Pedido } from "../../models/pedido.models";

// Estrategias de pago
export interface EstrategiaPago {
  pagar(monto: number, referencia: string): Promise<boolean>;
}

// Implementaciones dummy para arrancar:
export class SinPago implements EstrategiaPago {
  async pagar(): Promise<boolean> {
    return true;
  }
}

// Registro sencillo por nombre (puedes mover a otro archivo)
const estrategias: Record<string, EstrategiaPago> = {
  sinPago: new SinPago(),
  // "tarjeta": new PagoTarjeta(...),
  // "billetera": new PagoBilletera(...),
};

export class CheckoutService {
  async generarPedido(
    carritoId: mongoose.Types.ObjectId,
    comprador: mongoose.Types.ObjectId,
    estrategiaNombre: keyof typeof estrategias = "sinPago"
  ) {
    const carrito = await Carrito.findOne({ _id: carritoId, usuario: comprador });
    if (!carrito) throw new Error("Carrito no encontrado");

    await carrito.calcularTotal();

    const pedido = await Pedido.create({
      comprador,
      items: carrito.items.map((i) => ({
        publicacion: i.publicacion,
        cantidad: i.cantidad,
        subtotal: i.subtotal,
      })),
      montoTotal: carrito.total,
      estado: "CREADO",
      estrategia: estrategiaNombre,
    });

    return pedido;
  }

  async pagarPedido(pedidoId: mongoose.Types.ObjectId): Promise<boolean> {
    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) throw new Error("Pedido no encontrado");
    if (pedido.estado !== "CREADO") throw new Error("Pedido no está en estado válido para pago");

    const estrategia = estrategias[pedido.estrategia || "sinPago"];
    const ok = await estrategia.pagar(pedido.montoTotal, String(pedido._id));
    if (ok) {
      pedido.estado = "PAGADO";
      await pedido.save();
    }
    return ok;
  }
}
