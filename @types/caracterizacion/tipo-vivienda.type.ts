import { CtmType } from '@common/domain/types';

export type TipoViviendaCode = 1 | 2 | 3 | 4 | 5;

export class TipoViviendaType extends CtmType<TipoViviendaCode> {}

const CASA = new TipoViviendaType(1, 'CASA');
const APARTAMENTO = new TipoViviendaType(2, 'APARTAMENTO');
const CUARTO = new TipoViviendaType(3, 'CUARTO');
const ALBERGUE = new TipoViviendaType(4, 'ALBERGUE');
const OTRO = new TipoViviendaType(5, 'OTRO');

export function tipoViviendaTypeFactory(code: TipoViviendaCode): TipoViviendaType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return CASA;
    case 2:
      return APARTAMENTO;
    case 3:
      return CUARTO;
    case 4:
      return ALBERGUE;
    case 5:
      return OTRO;
    default:
      throw new Error('No existe tipo de TipoVivienda valido con este codigo');
  }
}

export const TIPOS_VIVIENDA_VALUES = [CASA, APARTAMENTO, CUARTO, ALBERGUE, OTRO];

export const TIPOS_VIVIENDA = {
  CASA,
  APARTAMENTO,
  CUARTO,
  ALBERGUE,
  OTRO,
};
