import { CtmType } from '@common/domain/types';

export type DocumentoPropiedadCode = 1 | 2 | 3 | 4 | 5 | 6;

export class DocumentoPropiedadType extends CtmType<DocumentoPropiedadCode> {}

const ESCRITURA_REGISTRADA = new DocumentoPropiedadType(1, 'ESCRITURA REGISTRADA');
const ESCRITURA_SINREGISTRO = new DocumentoPropiedadType(2, 'ESCRITURA SIN REGISTRO');
const CONTRATO_COMPRAVENTA = new DocumentoPropiedadType(3, 'CONTRATO DE COMPRAVENTA');
const CERT_SANA_POSESION = new DocumentoPropiedadType(4, 'CERTIFICADO DE SANA POSESIÓN');
const OTRO = new DocumentoPropiedadType(5, 'OTRO');
const NINGUNO = new DocumentoPropiedadType(6, 'NINGUNO');

export function documentoPropiedadTypeFactory(
  code: DocumentoPropiedadCode
): DocumentoPropiedadType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return ESCRITURA_REGISTRADA;
    case 2:
      return ESCRITURA_SINREGISTRO;
    case 3:
      return CONTRATO_COMPRAVENTA;
    case 4:
      return CERT_SANA_POSESION;
    case 5:
      return OTRO;
    case 6:
      return NINGUNO;
    default:
      throw new Error('No existe tipo de DocumentoPropiedad valido con este codigo');
  }
}

export const DOCUMENTOS_PROPIEDAD_VALUES = [
  ESCRITURA_REGISTRADA,
  ESCRITURA_SINREGISTRO,
  CONTRATO_COMPRAVENTA,
  CERT_SANA_POSESION,
  OTRO,
  NINGUNO,
];

export const DOCUMENTOS_PROPIEDAD = {
  ESCRITURA_REGISTRADA,
  ESCRITURA_SINREGISTRO,
  CONTRATO_COMPRAVENTA,
  CERT_SANA_POSESION,
  OTRO,
  NINGUNO,
};
