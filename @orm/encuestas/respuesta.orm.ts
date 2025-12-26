import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { EncuestaOrm } from './encuesta.orm';
import { PreguntaOrm } from './pregunta.orm';
import { TABLE_NAMES } from '@common/application/constants';

@Entity(TABLE_NAMES.encuestas.respuestas)
export class RespuestaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @ManyToOne(() => EncuestaOrm, encuestado => encuestado.respuestas)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.encuestas, referencedColumnName: 'id' }])
  encuesta: EncuestaOrm;

  @Column({ name: TABLE_NAMES.encuestas.encuestas })
  encuestaId: number;

  @ManyToOne(() => PreguntaOrm)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.preguntas, referencedColumnName: 'id' }])
  pregunta: PreguntaOrm;

  @Column({ name: TABLE_NAMES.encuestas.preguntas })
  preguntaId: number;

  @Column({ name: 'RESPUESTA', length: 1000, nullable: true })
  respuesta: string;
}
