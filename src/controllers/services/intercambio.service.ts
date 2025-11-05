import { Types } from 'mongoose';
import { PublicacionIntercambio } from '../../models/publicacion.model';
import { SolicitudIntercambio } from '../../models/solicitud-intercambio.model';
import Usuario from '../../models/user.model';

export class IntercambioService {

  static async crearSolicitud(pubId: string, ofertanteId: string, descripcion: string) {
    // 1) Verifica que la publicación de intercambio exista
    const pub = await PublicacionIntercambio.findById(pubId);
    if (!pub) throw new Error('Publicación no encontrada');

    // 2) Crea la solicitud
    const sol = await SolicitudIntercambio.create({
      ofertante: new Types.ObjectId(ofertanteId),
      publicacionObjetivo: pub._id,
      descripcionOferta: descripcion,
      // estado por defecto: 'pendiente' (lo pone el schema)
    });

    // 3) Notifica al dueño (placeholder del diagrama)

    //que lo queeeeeeeee
    try {
      const duenio = await Usuario.findById(pub.duenio);
      if (duenio?.recibirNotificacion) {
        duenio.recibirNotificacion(`Nueva oferta de intercambio en tu publicación ${pub._id}`);
      }
    } catch {
      /* notificación best-effort */
    }

    return sol;
  }

  /**
   * Decidir (aceptar/rechazar) una solicitud
   */
  static async decidir(solicitudId: string, aceptar: boolean) {
    const sol = await SolicitudIntercambio.findById(solicitudId);
    if (!sol) throw new Error('Solicitud no encontrada');

    // En vez de llamar métodos del documento (que TS no reconoce),
    // actualizamos el estado directamente:
    sol.set({ estado: aceptar ? 'aceptada' : 'rechazada' });
    await sol.save();

    // Si se acepta, cerramos la publicación objetivo
    if (aceptar) {
      await PublicacionIntercambio.findByIdAndUpdate(sol.publicacionObjetivo, {
        estado: 'cerrada',
      });
    }

    return sol;
  }
}

export default IntercambioService;
