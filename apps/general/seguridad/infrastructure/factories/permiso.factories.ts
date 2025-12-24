import { PermisoOrm } from '@orm/general/seguridad';
import { ModuloBasicoRes } from '@gen/seguridad/application/responses';
import { RSA_SERVICES } from '@common/application/services';

export const permisoOrmToModuloBasicoResFactory = (data: PermisoOrm): ModuloBasicoRes => {
  const e = new ModuloBasicoRes();
  e.id = RSA_SERVICES.encryptId(data.id);
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  return e;
};
