import { CtmType } from '@common/domain/types';

export type GeneroFamiliarCode = 1 | 2;

export class GeneroFamiliarType extends CtmType<GeneroFamiliarCode> {}

const MASCULINO = new GeneroFamiliarType(1, 'MASCULINO');
const FEMENINO = new GeneroFamiliarType(2, 'FEMENINO');

export function generoFamiliarTypeFactory(code: GeneroFamiliarCode): GeneroFamiliarType {
  switch (code) {
    case 1:
      return MASCULINO;
    case 2:
      return FEMENINO;
    default:
      throw new Error('No existe status de usuario valido con este codigo');
  }
}

export const GENERO_FAMILIAR = { MASCULINO, FEMENINO };

export const GENERO_FAMILIAR_VALUES = [MASCULINO, FEMENINO];
