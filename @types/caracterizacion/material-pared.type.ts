import { CtmType } from '@common/domain/types';

export type MaterialParedCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class MaterialParedType extends CtmType<MaterialParedCode> {}

const LADRILLO_BLOQUE = new MaterialParedType(1, 'LADRILLO/BLOQUE');
const MADERA_PULIDA = new MaterialParedType(2, 'MADERA PULIDA');
const MADERA_BURDA = new MaterialParedType(3, 'MADERA BURDA');
const BAHAREQUE = new MaterialParedType(4, 'BAHAREQUE');
const ADOBE_TAPIA = new MaterialParedType(5, 'ADOBE/TAPIA');
const GUADUA = new MaterialParedType(6, 'GUADUA');
const ZINC_TELA_CARTON = new MaterialParedType(7, 'ZINC/TELA/CARTÓN');
const OTRO_MATERIAL = new MaterialParedType(8, 'OTRO MATERIAL');
const SIN_PAREDES = new MaterialParedType(9, 'SIN PAREDES');

export function materialParedTypeFactory(code: MaterialParedCode): MaterialParedType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return LADRILLO_BLOQUE;
    case 2:
      return MADERA_PULIDA;
    case 3:
      return MADERA_BURDA;
    case 4:
      return BAHAREQUE;
    case 5:
      return ADOBE_TAPIA;
    case 6:
      return GUADUA;
    case 7:
      return ZINC_TELA_CARTON;
    case 8:
      return OTRO_MATERIAL;
    case 9:
      return SIN_PAREDES;
    default:
      throw new Error('No existe tipo de MaterialPared valido con este codigo');
  }
}

export const MATERIALES_PARED_VALUES = [
  LADRILLO_BLOQUE,
  MADERA_PULIDA,
  MADERA_BURDA,
  BAHAREQUE,
  ADOBE_TAPIA,
  GUADUA,
  ZINC_TELA_CARTON,
  OTRO_MATERIAL,
  SIN_PAREDES,
];

export const MATERIALES_PARED = {
  LADRILLO_BLOQUE,
  MADERA_PULIDA,
  MADERA_BURDA,
  BAHAREQUE,
  ADOBE_TAPIA,
  GUADUA,
  ZINC_TELA_CARTON,
  OTRO_MATERIAL,
  SIN_PAREDES,
};
