import { FetchModuloRes, ModuloBasicoRes } from '@gen/seguridad/application/responses';
import { ModuloOrm } from '@orm/general/seguridad';

export const moduloOrmToFetchModuloResFactory = (data: ModuloOrm) => {
  const e = new FetchModuloRes();
  e.id = data.id as any;
  e.codigo = data.codigo;
  e.nombre = data.nombre;
  e.subModulos = data.subModulos.map(s => {
    const sm = new ModuloBasicoRes();
    sm.id = s.id as any;
    sm.codigo = s.codigo;
    sm.nombre = s.nombre;
    return sm;
  });
  return e;
};
