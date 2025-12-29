import { ORM_SHARED_GENERAL_ENTITIES } from './general';
import { ORM_UBI_ENTITIES } from './ubicacion';

export const ORM_SHARED_ENTITIES = [...ORM_UBI_ENTITIES, ...ORM_SHARED_GENERAL_ENTITIES];
