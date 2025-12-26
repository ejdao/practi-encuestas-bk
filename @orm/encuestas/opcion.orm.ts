import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { PreguntaOrm } from './pregunta.orm';
import { TABLE_NAMES } from '@common/application/constants';

@Entity(TABLE_NAMES.encuestas.opciones)
export class OpcionOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'ACTIVA' })
  isActiva: boolean;

  @Column({ name: 'ORDEN', type: 'smallint' })
  orden: number;

  @Column({ name: 'INDICADOR', length: 5, nullable: true })
  indicador: string;

  @Column({ name: 'NOMBRE', length: 200 })
  nombre: string;

  @ManyToOne(() => PreguntaOrm, pregunta => pregunta.opciones)
  @JoinColumn({ name: TABLE_NAMES.encuestas.preguntas })
  pregunta: PreguntaOrm;
}
