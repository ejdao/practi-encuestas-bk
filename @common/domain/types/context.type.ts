import { CtmType } from './base.type';

export type CtmContextCode = 'SHARED' | 'DEFAULT';

export class CtmContextType extends CtmType<CtmContextCode> {}

const SHARED = new CtmContextType('SHARED', 'Shared BBDD');
const DEFAULT = new CtmContextType('DEFAULT', 'Default BBDD');

export const ctmContextTypeFactory = (code: CtmContextCode) => {
  switch (code) {
    case 'SHARED': return SHARED;
    case 'DEFAULT': return DEFAULT;
    default: throw new Error('No existe contexto con este codigo');
  }
};

export const CTM_CONTEXTS = { SHARED, DEFAULT };
export const CTM_LOGIC_CONTEXTS_VALUES = [DEFAULT];
export const CTM_COMMON_CONTEXTS_VALUES = [SHARED];
