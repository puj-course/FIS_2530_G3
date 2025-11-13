// IMPORTA TODOS TUS MODELOS
import Categoria from '../../../src/models/categoria.model';
import { InventoryModel } from '../../../src/models/inventory.model';
import { ItemCarritoSchema } from '../../../src/models/item-carrito.models';
import { Pedido } from '../../../src/models/pedido.models';
import Prenda from '../../../src/models/prenda.models';
import PublicacionVenta from '../../../src/models/publicacion-venta.models';
import Publicacion from '../../../src/models/publicacion.model';
import ReciboDonacion from '../../../src/models/recibo-donacion.model';
import Role from '../../../src/models/role.model';
import SolicitudIntercambio from '../../../src/models/solicitud-intercambio.model';
import Usuario from '../../../src/models/user.model';
import Carrito from '../../../src/models/carrito.models';

describe('Modelos Mongoose básicos', () => {
  it('los modelos y esquemas están definidos', () => {
    expect(Categoria).toBeDefined();
    expect(InventoryModel).toBeDefined();      
    expect(ItemCarritoSchema).toBeDefined();   
    expect(Pedido).toBeDefined();
    expect(Prenda).toBeDefined();
    expect(PublicacionVenta).toBeDefined();
    expect(Publicacion).toBeDefined();
    expect(ReciboDonacion).toBeDefined();
    expect(Role).toBeDefined();
    expect(SolicitudIntercambio).toBeDefined();
    expect(Usuario).toBeDefined();
    expect(Carrito).toBeDefined();
  });
});

