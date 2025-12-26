import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EncuestaOrm } from './encuesta.orm';
import { TABLE_NAMES } from '@common/application/constants';
import { TipoDocUsuarioCode } from '@ctypes/general/usuario';
import { ParentezcoCode } from '@ctypes/encuestas';
import { UsuarioOrm } from '@orm/general/auth';

@Entity(TABLE_NAMES.encuestas.encuestados)
export class EncuestadoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'ENCNOMS', length: 50, nullable: true })
  nombres: string;

  @Column({ name: 'ENCAPES', length: 50, nullable: true })
  apellidos: string;

  @Column({ name: 'NUMTELEFO', length: 15, nullable: true })
  numeroTelefono: string;

  @Column({ name: 'ENCNOMCOM', length: 100 })
  nombreCompleto: string;

  @Column({ name: 'ENCTIPDOC', type: 'smallint' })
  tipoDocumentoCode: TipoDocUsuarioCode;

  @Column({ name: 'ENCNUMDOC', length: 15 })
  numeroDocumento: string;

  @Column({ name: 'ENCTILIBMIL' })
  tieneLibretaMilitar: boolean;

  @Column({ name: 'ENCDIRECC', length: 50, nullable: true })
  direccion: string;

  @Column({ name: 'ENCPARENZCO', type: 'smallint' })
  parentezcoCode: ParentezcoCode;

  @ManyToOne(() => EncuestadoOrm)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.encuestados, referencedColumnName: 'id' }])
  jefeHogar: EncuestadoOrm;

  @Column({ name: TABLE_NAMES.encuestas.encuestados, nullable: true })
  jefeHogarId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.usuarios, referencedColumnName: 'id' }])
  creadoPor: UsuarioOrm;

  @Column({ name: TABLE_NAMES.general.usuarios })
  creadoPorId: number;

  @OneToMany(() => EncuestaOrm, encuesta => encuesta.encuestado)
  encuestas: EncuestaOrm[];

  @OneToMany(() => EncuestadoOrm, encuestado => encuestado.jefeHogar)
  familiares: EncuestadoOrm[];

  @Column({ name: `FECHACREACION` })
  fechaCreacion: Date;

  @Column({ name: `FECNACIMI`, nullable: true })
  fechaNacimiento: Date;
}
