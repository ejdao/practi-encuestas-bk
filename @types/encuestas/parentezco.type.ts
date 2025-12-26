import { CtmType } from '@common/domain/types';

export type ParentezcoCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export class ParentezcoType extends CtmType<ParentezcoCode> {}

const JEFE_HOGAR = new ParentezcoType(1, 'JEFE DEL HOGAR');
const CONJUGUE_COMPANERO = new ParentezcoType(2, 'CONJUGUE/COMPAÑERO');
const HIJO = new ParentezcoType(3, 'HIJO');
const PADRE = new ParentezcoType(4, 'PADRE');
const NIETO = new ParentezcoType(5, 'NIETO');
const ABUELO = new ParentezcoType(6, 'ABUELO');
const YERNO = new ParentezcoType(7, 'YERNO');
const CUNADO = new ParentezcoType(8, 'CUÑADO');
const SUEGRO = new ParentezcoType(9, 'SUEGRO');
const HERMANO = new ParentezcoType(10, 'HERMANO');
const SOBRINO = new ParentezcoType(11, 'SOBRINO');
const TIO = new ParentezcoType(12, 'TIO');
const OTRO = new ParentezcoType(13, 'OTRO');

export function parentezcoTypeFactory(code: ParentezcoCode): ParentezcoType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return JEFE_HOGAR;
    case 2:
      return CONJUGUE_COMPANERO;
    case 3:
      return HIJO;
    case 4:
      return PADRE;
    case 5:
      return NIETO;
    case 6:
      return ABUELO;
    case 7:
      return YERNO;
    case 8:
      return CUNADO;
    case 9:
      return SUEGRO;
    case 10:
      return HERMANO;
    case 11:
      return SOBRINO;
    case 12:
      return TIO;
    case 13:
      return OTRO;
    default:
      throw new Error('No existe tipo de parentezco valido con este codigo');
  }
}

export const PARENTEZCOS_VALUES = [
  JEFE_HOGAR,
  CONJUGUE_COMPANERO,
  HIJO,
  PADRE,
  NIETO,
  ABUELO,
  YERNO,
  CUNADO,
  SUEGRO,
  HERMANO,
  SOBRINO,
  TIO,
  OTRO,
];

export const PARENTEZCOS = {
  JEFE_HOGAR,
  CONJUGUE_COMPANERO,
  HIJO,
  PADRE,
  NIETO,
  ABUELO,
  YERNO,
  CUNADO,
  SUEGRO,
  HERMANO,
  SOBRINO,
  TIO,
  OTRO,
};
