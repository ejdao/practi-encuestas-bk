import { CtmType } from './base.type';

export enum CtmContexts {
  SHARED = 'SHARED',
  DEFAULT = 'DEFAULT'
}

export type CtmContextCode = CtmContexts;

export class CtmContextType extends CtmType<CtmContextCode> {}

const SHARED = new CtmContextType(CtmContexts.SHARED, 'Shared BBDD');
const DEFAULT = new CtmContextType(CtmContexts.DEFAULT, 'Default BBDD');

export const ctmContextTypeFactory = (code: CtmContextCode) => {
  switch (code) {
    case CtmContexts.SHARED: return SHARED;
    case CtmContexts.DEFAULT: return DEFAULT;
    default: throw new Error('No existe contexto con este codigo');
  }
};

export const CTM_CONTEXTS = { SHARED, DEFAULT };
export const CTM_LOGIC_CONTEXTS_VALUES = [DEFAULT];
export const CTM_COMMON_CONTEXTS_VALUES = [SHARED];
