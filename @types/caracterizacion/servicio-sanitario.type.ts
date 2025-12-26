import { CtmType } from '@common/domain/types';

export type ServicioSanitarioCode = 1 | 2 | 3 | 4 | 5;

export class ServicioSanitarioType extends CtmType<ServicioSanitarioCode> {}

const INOD_CONEC_ALCANT = new ServicioSanitarioType(1, 'INODORO CONECTADO A ALCANTARILLA');
const INOD_CONEC_POZECT = new ServicioSanitarioType(2, 'INODORO CONECTADO A POZO SÉPTICO');
const INOD_SIN_CONEC = new ServicioSanitarioType(3, 'INODORO SIN CONEXIÓN');
const LETR_SIN_CONEC = new ServicioSanitarioType(4, 'LETRINA SIN CONEXIÓN');
const NINGUNO = new ServicioSanitarioType(5, 'NINGUNO');

export function servicioSanitarioTypeFactory(code: ServicioSanitarioCode): ServicioSanitarioType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return INOD_CONEC_ALCANT;
    case 2:
      return INOD_CONEC_POZECT;
    case 3:
      return INOD_SIN_CONEC;
    case 4:
      return LETR_SIN_CONEC;
    case 5:
      return NINGUNO;
    default:
      throw new Error('No existe tipo de ServicioSanitario valido con este codigo');
  }
}

export const SERVICIOS_SANITARIOS_VALUES = [
  INOD_CONEC_ALCANT,
  INOD_CONEC_POZECT,
  INOD_SIN_CONEC,
  LETR_SIN_CONEC,
  NINGUNO,
];

export const SERVICIOS_SANITARIOS = {
  INOD_CONEC_ALCANT,
  INOD_CONEC_POZECT,
  INOD_SIN_CONEC,
  LETR_SIN_CONEC,
  NINGUNO,
};
