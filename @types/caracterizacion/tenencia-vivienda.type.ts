import { CtmType } from '@common/domain/types';

export type TenenciaViviendaCode = 1 | 2 | 3 | 4 | 5;

export class TenenciaViviendaType extends CtmType<TenenciaViviendaCode> {}

const VIVIENDA_PROPIA = new TenenciaViviendaType(1, 'VIVIENDA PROPIA');
const ARRENDATARIO = new TenenciaViviendaType(2, 'ARRENDATARIO');
const POSEEDOR = new TenenciaViviendaType(3, 'POSEEDOR');
const USUFRUTO = new TenenciaViviendaType(4, 'USUFRUTO');
const OTRO = new TenenciaViviendaType(5, 'OTRO');

export function tenenciaViviendaTypeFactory(code: TenenciaViviendaCode): TenenciaViviendaType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return VIVIENDA_PROPIA;
    case 2:
      return ARRENDATARIO;
    case 3:
      return POSEEDOR;
    case 4:
      return USUFRUTO;
    case 5:
      return OTRO;
    default:
      throw new Error('No existe tipo de TenenciaVivienda valido con este codigo');
  }
}

export const TENENCIAS_VIVIENDA_VALUES = [VIVIENDA_PROPIA, ARRENDATARIO, POSEEDOR, USUFRUTO, OTRO];

export const TENENCIAS_VIVIENDA = {
  VIVIENDA_PROPIA,
  ARRENDATARIO,
  POSEEDOR,
  USUFRUTO,
  OTRO,
};
