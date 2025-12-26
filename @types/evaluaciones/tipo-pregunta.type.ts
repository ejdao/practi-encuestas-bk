import { CtmType } from '@common/domain/types';

export type TipoPreguntaCode =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 18
  | 999;

export class TipoPreguntaType extends CtmType<TipoPreguntaCode> {}

const SELECCION_UNICA = new TipoPreguntaType(1, 'SELECCIÓN UNICA');
const SELECCION_MULTIPLE = new TipoPreguntaType(2, 'SELECCIÓN MULTIPLE');
const ABIERTA_LARGA = new TipoPreguntaType(3, 'ABIERTA (CADENA DE TEXTO LARGA)');
const ABIERTA_CORTA = new TipoPreguntaType(11, 'ABIERTA (CADENA DE TEXTO CORTA)');
const ABIERTA_NUMERICO = new TipoPreguntaType(4, 'ABIERTA (VALOR NUMERICO)');
const SI_NO = new TipoPreguntaType(5, 'SI / NO');
const PAIS = new TipoPreguntaType(12, 'PAIS');
const DEPARTAMENTO = new TipoPreguntaType(6, 'DEPARTAMENTO');
const MUNICIPIO = new TipoPreguntaType(7, 'MUNICIPIO');
const CORREGIMIENTO = new TipoPreguntaType(8, 'CORREGIMIENTO');
const BARRIO_VEREDA = new TipoPreguntaType(9, 'BARRIO/VEREDA');
const TIPO_DOCUMENTO = new TipoPreguntaType(13, 'TIPO DOCUMENTO');
const PARENTEZCO = new TipoPreguntaType(14, 'PARENTEZCO');
const FECHA = new TipoPreguntaType(15, 'FECHA');
const EPS = new TipoPreguntaType(16, 'EPS');
const VALOR_MONETARIO = new TipoPreguntaType(18, 'VALOR MONETARIO');
const COMPLEMENTADA = new TipoPreguntaType(999, 'COMPLEMENTADA');

export function tipoPreguntaTypeFactory(code: TipoPreguntaCode): TipoPreguntaType {
  if (!code) return code as any;
  switch (code) {
    case 1:
      return SELECCION_UNICA;
    case 2:
      return SELECCION_MULTIPLE;
    case 3:
      return ABIERTA_LARGA;
    case 11:
      return ABIERTA_CORTA;
    case 4:
      return ABIERTA_NUMERICO;
    case 5:
      return SI_NO;
    case 12:
      return PAIS;
    case 6:
      return DEPARTAMENTO;
    case 7:
      return MUNICIPIO;
    case 8:
      return CORREGIMIENTO;
    case 9:
      return BARRIO_VEREDA;
    case 13:
      return TIPO_DOCUMENTO;
    case 14:
      return PARENTEZCO;
    case 15:
      return FECHA;
    case 16:
      return EPS;
    case 18:
      return VALOR_MONETARIO;
    case 999:
      return COMPLEMENTADA;
    default:
      throw new Error('No existe tipo de pregunta valida con este codigo');
  }
}

export const TIPOS_PREGUNTA_VALUES = [
  SELECCION_UNICA,
  SELECCION_MULTIPLE,
  ABIERTA_LARGA,
  ABIERTA_CORTA,
  ABIERTA_NUMERICO,
  SI_NO,
  PAIS,
  DEPARTAMENTO,
  MUNICIPIO,
  CORREGIMIENTO,
  BARRIO_VEREDA,
  TIPO_DOCUMENTO,
  PARENTEZCO,
  FECHA,
  EPS,
  VALOR_MONETARIO,
  COMPLEMENTADA,
];

export const TIPOS_PREGUNTA = {
  SELECCION_UNICA,
  SELECCION_MULTIPLE,
  ABIERTA_LARGA,
  ABIERTA_CORTA,
  ABIERTA_NUMERICO,
  SI_NO,
  PAIS,
  DEPARTAMENTO,
  MUNICIPIO,
  CORREGIMIENTO,
  BARRIO_VEREDA,
  TIPO_DOCUMENTO,
  PARENTEZCO,
  FECHA,
  EPS,
  VALOR_MONETARIO,
  COMPLEMENTADA,
};
