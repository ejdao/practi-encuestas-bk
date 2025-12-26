import { CtmType } from '@common/domain/types';

export type OrdenOpcionCode = 1 | 2 | 3;

export class OrdenOpcionType extends CtmType<OrdenOpcionCode> {}

const ORDEN_PREDEFINIDO = new OrdenOpcionType(1, 'ORDEN PREDEFINIDO');
const ORDEN_CREACION = new OrdenOpcionType(2, 'ORDEN DE CREACIÓN');
const ORDEN_ALEATORIO = new OrdenOpcionType(2, 'ORDEN ALEATORIO');

export function ordenOpcionTypeFactory(code: OrdenOpcionCode): OrdenOpcionType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return ORDEN_PREDEFINIDO;
    case 2:
      return ORDEN_CREACION;
    case 3:
      return ORDEN_ALEATORIO;
    default:
      throw new Error('No existe tipo de opción valida con este codigo');
  }
}

export const ORDEN_OPCIONES_VALUES = [ORDEN_PREDEFINIDO, ORDEN_CREACION, ORDEN_ALEATORIO];

export const ORDEN_OPCIONES = { ORDEN_PREDEFINIDO, ORDEN_CREACION, ORDEN_ALEATORIO };
