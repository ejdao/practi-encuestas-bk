import { CtmType } from '@common/domain/types';

export type EtniaFamiliarCode = 1 | 2 | 3 | 4;

export class EtniaFamiliarType extends CtmType<EtniaFamiliarCode> {}

const NARP = new EtniaFamiliarType(1, 'NARP');
const INDIGENA = new EtniaFamiliarType(2, 'INDÍGENA');
const ROM = new EtniaFamiliarType(3, 'ROM');
const NINGUNA = new EtniaFamiliarType(4, 'NINGUNA');

export function etniaFamiliarTypeFactory(code: EtniaFamiliarCode): EtniaFamiliarType {
  switch (code) {
    case 1:
      return NARP;
    case 2:
      return INDIGENA;
    case 3:
      return ROM;
    case 4:
      return NINGUNA;
    default:
      throw new Error('No existe etnia valida con este codigo');
  }
}

export const ETNIA_FAMILIAR = { NARP, INDIGENA, ROM, NINGUNA };

export const ETNIA_FAMILIAR_VALUES = [NARP, INDIGENA, ROM, NINGUNA];
