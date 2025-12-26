import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PermisoOrm } from '@orm/general/seguridad';
import { PreguntaOrm } from './pregunta.orm';
import { TABLE_NAMES } from '@common/application/constants';
import { TipoFormatoCode } from '@ctypes/evaluaciones';
import { UsuarioOrm } from '@orm/general/auth';

@Entity(TABLE_NAMES.encuestas.formatos)
export class FormatoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'ACTIVA' })
  isActiva: boolean;

  @Column({ name: 'TIPOFORMATO', type: 'smallint' })
  tipoCode: TipoFormatoCode;

  @ManyToOne(() => PermisoOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.seguridad.permisos, referencedColumnName: 'id' }])
  permisoRequerido: PermisoOrm;

  @Column({ name: TABLE_NAMES.general.seguridad.permisos, nullable: true })
  permisoRequeridoId: number;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @OneToMany(() => PreguntaOrm, pregunta => pregunta.formato)
  preguntas: PreguntaOrm[];

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.usuarios, referencedColumnName: 'id' }])
  creadoPor: UsuarioOrm;

  @Column({ name: TABLE_NAMES.general.usuarios })
  creadoPorId: number;

  @Column({ name: 'CREATEDAT' })
  fechaCreacion: Date;
}
