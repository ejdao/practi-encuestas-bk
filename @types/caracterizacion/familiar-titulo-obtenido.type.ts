import { CtmType } from '@common/domain/types';

export type TituloAcademicoCode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class TituloAcademicoType extends CtmType<TituloAcademicoCode> {}

const PRIMARIA = new TituloAcademicoType(1, 'PRIMARIA');
const SECUNDARIA = new TituloAcademicoType(2, 'SECUNDARIA');
const TECNICO = new TituloAcademicoType(3, 'TECNICO');
const TECNOLOGO = new TituloAcademicoType(4, 'TECNÓLOGO');
const UNIVERSIDAD = new TituloAcademicoType(5, 'UNIVERSIDAD');
const POSGRADO = new TituloAcademicoType(6, 'POSGRADO');
const N_N = new TituloAcademicoType(7, 'N/N');

export function tituloAcademicoTypeFactory(code: TituloAcademicoCode): TituloAcademicoType {
  switch (code) {
    case 1:
      return PRIMARIA;
    case 2:
      return SECUNDARIA;
    case 3:
      return TECNICO;
    case 4:
      return TECNOLOGO;
    case 5:
      return UNIVERSIDAD;
    case 6:
      return POSGRADO;
    case 7:
      return N_N;
    default:
      throw new Error('No existe etnia valida con este codigo');
  }
}

export const TITULO_ACADEMICO = {
  PRIMARIA,
  SECUNDARIA,
  TECNICO,
  TECNOLOGO,
  UNIVERSIDAD,
  POSGRADO,
  N_N,
};

export const TITULO_ACADEMICO_VALUES = [
  PRIMARIA,
  SECUNDARIA,
  TECNICO,
  TECNOLOGO,
  UNIVERSIDAD,
  POSGRADO,
  N_N,
];
