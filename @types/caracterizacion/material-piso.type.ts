import { CtmType } from '@common/domain/types';

export type MaterialPisoCode = 1 | 2 | 3 | 4 | 5 | 6;

export class MaterialPisoType extends CtmType<MaterialPisoCode> {}

const TIERRA = new MaterialPisoType(1, 'TIERRA');
const CEMENTO = new MaterialPisoType(2, 'CEMENTO');
const MADERA = new MaterialPisoType(3, 'MADERA');
const BALDOSA = new MaterialPisoType(4, 'BALDOSA');
const MARMOL = new MaterialPisoType(5, 'MÁRMOL');
const OTRO = new MaterialPisoType(6, 'OTRO');

export function materialPisoTypeFactory(code: MaterialPisoCode): MaterialPisoType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return TIERRA;
    case 2:
      return CEMENTO;
    case 3:
      return MADERA;
    case 4:
      return BALDOSA;
    case 5:
      return MARMOL;
    case 6:
      return OTRO;
    default:
      throw new Error('No existe tipo de MaterialPiso valido con este codigo');
  }
}

export const MATERIALES_PISO_VALUES = [TIERRA, CEMENTO, MADERA, BALDOSA, MARMOL, OTRO];

export const MATERIALES_PISO = {
  TIERRA,
  CEMENTO,
  MADERA,
  BALDOSA,
  MARMOL,
  OTRO,
};
