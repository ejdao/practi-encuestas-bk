import { CtmType } from '@common/domain/types';

export type TipoFormatoCode = 1 | 2;

export class TipoFormatoType extends CtmType<TipoFormatoCode> {}

const EVALUACION = new TipoFormatoType(1, 'EVALUACIÓN');
const ENCUESTA = new TipoFormatoType(2, 'ENCUESTA');

export function tipoFormatoTypeFactory(code: TipoFormatoCode): TipoFormatoType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return EVALUACION;
    case 2:
      return ENCUESTA;
    default:
      throw new Error('No existe tipo de evaluación valida con este codigo');
  }
}

export const TIPOS_FORMATO_VALUES = [EVALUACION, ENCUESTA];

export const TIPOS_FORMATO = { EVALUACION, ENCUESTA };
