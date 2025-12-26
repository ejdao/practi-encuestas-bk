import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FormatoOrm } from './formato.orm';
import { EncuestadoOrm, RespuestaOrm } from '@orm/encuestas';
import { TABLE_NAMES } from '@common/application/constants';
import { UsuarioOrm } from '@orm/general/auth';

@Entity(TABLE_NAMES.encuestas.encuestas)
export class EncuestaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'ANULADA' })
  isAnulada: boolean;

  @Column({ name: 'CALIFICABLE' })
  isCalificable: boolean;

  @ManyToOne(() => FormatoOrm)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.formatos, referencedColumnName: 'id' }])
  formato: FormatoOrm;

  @Column({ name: TABLE_NAMES.encuestas.formatos })
  formatoId: number;

  @ManyToOne(() => EncuestadoOrm, encuestado => encuestado.encuestas)
  @JoinColumn({ name: TABLE_NAMES.encuestas.encuestados })
  encuestado: EncuestadoOrm;

  @Column({ name: TABLE_NAMES.encuestas.encuestados })
  encuestadoId: number;

  @OneToMany(() => RespuestaOrm, encuesta => encuesta.encuesta)
  respuestas: RespuestaOrm[];

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.usuarios, referencedColumnName: 'id' }])
  creadoPor: UsuarioOrm;

  @Column({ name: TABLE_NAMES.general.usuarios })
  creadoPorId: number;

  @Column({ name: 'CREATEDAT' })
  fechaCreacion: Date;
}
