import { TipoPreguntaType } from '@ctypes/evaluaciones';
import { PreguntaOrm } from '@orm/encuestas';

export class Respuesta {
  pregunta: PreguntaOrm;
  tipoPregunta: TipoPreguntaType;
  respuesta: string | boolean | number | number[];
}
