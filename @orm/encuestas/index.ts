import { EncuestaOrm } from './encuesta.orm';
import { EncuestadoOrm } from './encuestado.orm';
import { FormatoOrm } from './formato.orm';
import { OpcionOrm } from './opcion.orm';
import { PreguntaOrm } from './pregunta.orm';
import { RespuestaOrm } from './respuesta.orm';

export * from './encuesta.orm';
export * from './encuestado.orm';
export * from './formato.orm';
export * from './opcion.orm';
export * from './pregunta.orm';
export * from './respuesta.orm';

export const ORM_ECT_ENTITIES = [
  EncuestadoOrm,
  EncuestaOrm,
  FormatoOrm,
  OpcionOrm,
  PreguntaOrm,
  RespuestaOrm,
];
