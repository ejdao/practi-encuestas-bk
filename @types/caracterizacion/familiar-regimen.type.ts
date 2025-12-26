import { CtmType } from '@common/domain/types';

export type RegimenSaludCode = 1 | 2 | 3 | 4;

export class RegimenSaludType extends CtmType<RegimenSaludCode> {}

const CONTRIBUTIVO = new RegimenSaludType(1, 'CONTRIBUTIVO');
const SUBSIDIADO = new RegimenSaludType(2, 'SUBSIDIADO');
const ESPECIAL = new RegimenSaludType(3, 'ESPECIAL');
const NINGUNA = new RegimenSaludType(4, 'NINGUNA');

export function regimenSaludTypeFactory(code: RegimenSaludCode): RegimenSaludType {
  switch (code) {
    case 1:
      return CONTRIBUTIVO;
    case 2:
      return SUBSIDIADO;
    case 3:
      return ESPECIAL;
    case 4:
      return NINGUNA;
    default:
      throw new Error('No existe regimen de salud con este codigo');
  }
}

export const REGIMEN_SALUD = { CONTRIBUTIVO, SUBSIDIADO, ESPECIAL, NINGUNA };

export const REGIMEN_SALUD_VALUES = [CONTRIBUTIVO, SUBSIDIADO, ESPECIAL, NINGUNA];
