import { CtmType } from '@common/domain/types';

export type ProgramaSocialCode = 1 | 2 | 3 | 4 | 5 | 6;

export class ProgramaSocialType extends CtmType<ProgramaSocialCode> {}

const COMEDORES_COMUNITARIOS = new ProgramaSocialType(1, 'COMEDORES COMUNITARIOS');
const HOGAR_INFANTIL_CDI = new ProgramaSocialType(2, 'HOGAR INFANTIL/CDI');
const PROGRAMA_FAMI = new ProgramaSocialType(3, 'PROGRAMA FAMI');
const COLOMBIA_MAYOR = new ProgramaSocialType(4, 'COLOMBIA MAYOR');
const INGRESO_SOLIDARIO = new ProgramaSocialType(5, 'INGRESO SOLIDARIO');
const OTRO = new ProgramaSocialType(6, 'OTRO');

export function programaSocialTypeFactory(code: ProgramaSocialCode): ProgramaSocialType {
  switch (code) {
    case 1:
      return COMEDORES_COMUNITARIOS;
    case 2:
      return HOGAR_INFANTIL_CDI;
    case 3:
      return PROGRAMA_FAMI;
    case 4:
      return COLOMBIA_MAYOR;
    case 5:
      return INGRESO_SOLIDARIO;
    case 6:
      return OTRO;
    default:
      throw new Error('No existe discapacidad valida con este codigo');
  }
}

export const PROGRAMA_SOCIAL = {
  COMEDORES_COMUNITARIOS,
  HOGAR_INFANTIL_CDI,
  PROGRAMA_FAMI,
  COLOMBIA_MAYOR,
  INGRESO_SOLIDARIO,
  OTRO,
};

export const PROGRAMA_SOCIAL_VALUES = [
  COMEDORES_COMUNITARIOS,
  HOGAR_INFANTIL_CDI,
  PROGRAMA_FAMI,
  COLOMBIA_MAYOR,
  INGRESO_SOLIDARIO,
  OTRO,
];
