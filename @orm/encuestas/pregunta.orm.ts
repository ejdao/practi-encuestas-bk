import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FormatoOrm } from './formato.orm';
import { OpcionOrm } from './opcion.orm';
import { TABLE_NAMES } from '@common/application/constants';
import { TipoPreguntaCode } from '@ctypes/evaluaciones';

@Entity(TABLE_NAMES.encuestas.preguntas)
export class PreguntaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @ManyToOne(() => PreguntaOrm)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.preguntas, referencedColumnName: 'id' }])
  pregunta: PreguntaOrm;

  @Column({ name: TABLE_NAMES.encuestas.preguntas, nullable: true })
  preguntaId: number;

  @Column({ name: 'ACTIVA' })
  isActiva: boolean;

  @Column({ name: 'ORDEN', type: 'smallint' })
  orden: number;

  @Column({ name: 'NOMBRE', length: 100, nullable: true })
  nombre: string;

  @Column({ name: 'DESCRADIO', length: 300, nullable: true })
  descripcion: string;

  @Column({ name: 'TIPO', type: 'smallint' })
  tipoCode: TipoPreguntaCode;

  @Column({ name: 'LIMSELMULT', type: 'smallint', nullable: true })
  limSelMultiOrCarac: number | null;

  @Column({ name: 'OPCIONAL' })
  isOpcional: boolean;

  @ManyToOne(() => FormatoOrm, formato => formato.preguntas)
  @JoinColumn({ name: TABLE_NAMES.encuestas.formatos })
  formato: FormatoOrm;

  @Column({ name: TABLE_NAMES.encuestas.formatos })
  formatoId: number;

  @OneToMany(() => OpcionOrm, opcion => opcion.pregunta)
  opciones: OpcionOrm[];

  @Column({ name: 'PREGCLAVE', nullable: true })
  preguntaClaveId: number;

  @Column({ name: 'OPTOCLAVE', nullable: true })
  opcionClaveId: number;

  @Column({ name: 'KEYWORD', nullable: true, length: 50 })
  keyword: string;
}
