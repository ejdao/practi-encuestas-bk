import { PermisoOrm } from './permiso.orm';
import { ModuloOrm } from './modulo.orm';
import { SubModuloOrm } from './sub-modulo.orm';

export * from './permiso.orm';
export * from './modulo.orm';
export * from './sub-modulo.orm';

export const ORM_GEN_SEG_ENTITIES = [PermisoOrm, ModuloOrm, SubModuloOrm];
