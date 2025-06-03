import { TipoTransaccionOrm } from './tipo-transaccion.orm';
import { TransaccionOrm } from './transaccion.orm';

export * from './tipo-transaccion.orm';
export * from './transaccion.orm';

export const ORM_TRSC_ENTITIES = [TipoTransaccionOrm, TransaccionOrm];
