import { CtmType } from '@common/domain/types';

export type MaterialTechoCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export class MaterialTechoType extends CtmType<MaterialTechoCode> {}

const CEMENTO_CONCRETO = new MaterialTechoType(1, 'CEMENTO/CONCRETO');
const TEJA_BARRO = new MaterialTechoType(2, 'TEJA/BARRO');
const ZINC = new MaterialTechoType(3, 'ZINC');
const ASBESTO = new MaterialTechoType(4, 'ASBESTO');
const PLASTICO_CARTON_LATA = new MaterialTechoType(5, 'PLÁSTICO/CARTÓN/LATA');
const PALMA_PAJA = new MaterialTechoType(6, 'PALMA/PAJA');
const OTRO_MATERIAL = new MaterialTechoType(7, 'OTRO MATERIAL');
const SIN_TECHO = new MaterialTechoType(8, 'SIN TECHO');

export function materialTechoTypeFactory(code: MaterialTechoCode): MaterialTechoType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return CEMENTO_CONCRETO;
    case 2:
      return TEJA_BARRO;
    case 3:
      return ZINC;
    case 4:
      return ASBESTO;
    case 5:
      return PLASTICO_CARTON_LATA;
    case 6:
      return PALMA_PAJA;
    case 7:
      return OTRO_MATERIAL;
    case 8:
      return SIN_TECHO;
    default:
      throw new Error('No existe tipo de MaterialTecho valido con este codigo');
  }
}

export const MATERIALES_TECHO_VALUES = [
  CEMENTO_CONCRETO,
  TEJA_BARRO,
  ZINC,
  ASBESTO,
  PLASTICO_CARTON_LATA,
  PALMA_PAJA,
  OTRO_MATERIAL,
  SIN_TECHO,
];

export const MATERIALES_TECHO = {
  CEMENTO_CONCRETO,
  TEJA_BARRO,
  ZINC,
  ASBESTO,
  PLASTICO_CARTON_LATA,
  PALMA_PAJA,
  OTRO_MATERIAL,
  SIN_TECHO,
};
