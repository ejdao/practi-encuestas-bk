import { PermisoOrm } from '@orm/general/seguridad';
import { ModuloBasicoRes } from '@gen/seguridad/application/responses';

export const permisoOrmToModuloBasicoResFactory = (data: PermisoOrm): ModuloBasicoRes => {
  const e = new ModuloBasicoRes();
  e.id = data.id as any;
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  return e;
};
