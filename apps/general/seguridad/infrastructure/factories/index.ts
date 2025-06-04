import { OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';

export * from './modulos.factories';
export * from './permiso.factories';
export * from './rol.factories';
export * from './usuario.factories';

export const idToOnlyIdFromEntityResFactory = (id: number) => {
  const e = new OnlyIdFromEntityRes();
  e.id = id as any;
  return e;
};
