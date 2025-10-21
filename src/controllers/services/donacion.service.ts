import { Types } from 'mongoose';
import { PublicacionDonacion } from '../../models/publicacion.model';
import { ReciboDonacion } from '../../models/recibo-donacion.model';

export class DonacionService {
  static async generarRecibo(donanteId: string, publicacionId: string) {
    const pub = await PublicacionDonacion.findById(publicacionId);
    if (!pub) throw new Error('Publicación no encontrada');

    const folio = `R-${Date.now().toString(36).toUpperCase()}`;
    const recibo = await ReciboDonacion.create({
      donante: new Types.ObjectId(donanteId),
      publicacion: pub._id,
      numero: folio
    });

    await PublicacionDonacion.findByIdAndUpdate(pub._id, { estado: 'cerrada' });

    return recibo;
  }
}
