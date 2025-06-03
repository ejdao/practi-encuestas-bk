import { UsuarioOrm } from './usuario.orm';
import { RolOrm } from './rol.orm';

export * from './usuario.orm';
export * from './rol.orm';

export const ORM_AUTH_ENTITIES = [UsuarioOrm, RolOrm];
