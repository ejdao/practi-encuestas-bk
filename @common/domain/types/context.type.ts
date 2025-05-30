import { CtmType } from './base.type';

export type CtmContextCode = 'DEFAULT';

export class CtmContextType extends CtmType<CtmContextCode> {}

const DEFAULT = new CtmContextType('DEFAULT', 'Default BBDD');

export const ctmContextTypeFactory = (code: CtmContextCode) => {
  switch (code) {
    case 'DEFAULT':
      return DEFAULT;
    default:
      throw new Error('No existe contexto con este codigo');
  }
};

export const CTM_CONTEXTS = { DEFAULT };

export const CTM_LOGIC_CONTEXTS_VALUES = [DEFAULT];

export const CTM_COMMON_CONTEXTS_VALUES = [];
