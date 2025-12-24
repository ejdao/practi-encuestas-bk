import { ORM_TRSC_ENTITIES } from './transacciones';
import { ORM_GEN_SEG_ENTITIES } from './seguridad';
import { ORM_AUTH_ENTITIES } from './auth';

export const ORM_GEN_ENTITIES = [
  ...ORM_GEN_SEG_ENTITIES,
  ...ORM_AUTH_ENTITIES,
  ...ORM_TRSC_ENTITIES,
];
