import { CtmType } from '@common/domain/types';

export type DiscapacidadFamiliarCode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class DiscapacidadFamiliarType extends CtmType<DiscapacidadFamiliarCode> {}

const FISICA = new DiscapacidadFamiliarType(1, 'FÍSICA');
const AUDITIVA = new DiscapacidadFamiliarType(2, 'AUDITIVA');
const VISUAL = new DiscapacidadFamiliarType(3, 'VISUAL');
const MENTAL_COGNITIVA = new DiscapacidadFamiliarType(4, 'MENTAL/COGNITIVA');
const SISTEMICA = new DiscapacidadFamiliarType(5, 'SISTÉMICA');
const MULTIPLE = new DiscapacidadFamiliarType(6, 'MÚLTIPLE');
const NINGUNA = new DiscapacidadFamiliarType(7, 'NINGUNA');

export function discapacidadFamiliarTypeFactory(
  code: DiscapacidadFamiliarCode
): DiscapacidadFamiliarType {
  switch (code) {
    case 1:
      return FISICA;
    case 2:
      return AUDITIVA;
    case 3:
      return VISUAL;
    case 4:
      return MENTAL_COGNITIVA;
    case 5:
      return SISTEMICA;
    case 6:
      return MULTIPLE;
    case 7:
      return NINGUNA;
    default:
      throw new Error('No existe discapacidad valida con este codigo');
  }
}

export const DISCAPACIDAD_FAMILIAR = {
  FISICA,
  AUDITIVA,
  VISUAL,
  MENTAL_COGNITIVA,
  SISTEMICA,
  MULTIPLE,
  NINGUNA,
};

export const DISCAPACIDAD_FAMILIAR_VALUES = [
  FISICA,
  AUDITIVA,
  VISUAL,
  MENTAL_COGNITIVA,
  SISTEMICA,
  MULTIPLE,
  NINGUNA,
];
