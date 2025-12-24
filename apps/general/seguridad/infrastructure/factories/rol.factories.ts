import { RSA_SERVICES } from '@common/application/services';
import { FetchRolRes, ModuloBasicoRes, PermisoRes } from '@gen/seguridad/application/responses';
import { RolOrm } from '@orm/general/auth';

export const rolOrmToFetchRolResFactory = (data: RolOrm, addComplements: boolean): FetchRolRes => {
  const e = new FetchRolRes();
  e.id = RSA_SERVICES.encryptId(data.id);
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  if (addComplements) {
    e.permisos = [];
    data.permisos.forEach(p => {
      const np = new PermisoRes();
      np.isFromRol = true;
      np.id = RSA_SERVICES.encryptId(p.id);
      np.codigo = `${p.modulo ? p.modulo.codigo : ''}${p.subModulo ? p.subModulo.codigo : ''}${p.codigo}`;
      np.nombre = p.nombre;
      np.modulo = new ModuloBasicoRes();
      np.modulo.id = RSA_SERVICES.encryptId(p.modulo.id);
      np.modulo.codigo = p.modulo.codigo;
      np.modulo.nombre = p.modulo.nombre;
      np.subModulo = new ModuloBasicoRes();
      np.subModulo.id = RSA_SERVICES.encryptId(p.subModulo.id);
      np.subModulo.codigo = p.subModulo.codigo;
      np.subModulo.nombre = p.subModulo.nombre;
      e.permisos.push(np);
    });
  }

  return e;
};
