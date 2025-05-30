import { ORM_GEN_SEG_ENTITIES } from './seguridad';
import { ORM_GEN_UBI_ENTITIES } from './ubicacion';

import { TipoTransaccionOrm } from './tipo-transaccion.orm';
import { TransaccionOrm } from './transaccion.orm';
import { UsuarioOrm } from './usuario.orm';
import { RolOrm } from './rol.orm';

export * from './tipo-transaccion.orm';
export * from './transaccion.orm';
export * from './usuario.orm';
export * from './rol.orm';

export const ORM_GEN_ENTITIES = [
  ...ORM_GEN_SEG_ENTITIES,
  ...ORM_GEN_UBI_ENTITIES,
  TipoTransaccionOrm,
  TransaccionOrm,
  UsuarioOrm,
  RolOrm,
];
