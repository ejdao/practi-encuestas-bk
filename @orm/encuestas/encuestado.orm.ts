import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EncuestaOrm } from './encuesta.orm';
import { TABLE_NAMES } from '@common/application/constants';
import { TipoDocUsuarioCode } from '@ctypes/general/usuario';
import { ParentezcoCode } from '@ctypes/encuestas';
import { UsuarioOrm } from '@orm/general/auth';
import { EncCaracterizacionHogarOrm } from './caracterizacion-hogar.orm';
import { EncCaracterizacionViviendaOrm } from './caracterizacion-vivienda.orm';

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

  @OneToMany(() => EncCaracterizacionHogarOrm, caractHogar => caractHogar.encuestado)
  caracterizacionHogar: EncCaracterizacionHogarOrm[];

  @OneToMany(() => EncCaracterizacionHogarOrm, caractVivi => caractVivi.encuestado)
  caracterizacionVivienda: EncCaracterizacionViviendaOrm[];

  @OneToMany(() => EncuestadoOrm, encuestado => encuestado.jefeHogar)
  familiares: EncuestadoOrm[];

  @Column({ name: `FECHACREACION` })
  fechaCreacion: Date;

  @Column({ name: `FECNACIMI`, type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ name: `SEXO`, type: 'smallint', nullable: true })
  sexo: number;

  @Column({ name: `ETNIA`, type: 'smallint', nullable: true })
  etnia: number;

  @Column({ name: `ESVICTIMA`, nullable: true })
  esVictima: boolean;

  @Column({ name: `TIPODISCAPA`, type: 'smallint', nullable: true })
  tipoDiscapacidad: number;

  @Column({ name: `PROGRAMSOCIALEST`, length: 50, nullable: true })
  programasSocialesEstado: string;

  @Column({ name: `LEEYESCRIBE`, nullable: true })
  leeYEscribe: boolean;

  @Column({ name: `ULTIMTITUACADEM`, type: 'smallint', nullable: true })
  ultimoTituloAcademico: number;

  @Column({ name: `ACTUALMENTESTUDIA`, nullable: true })
  actualMenteEstudia: boolean;

  @Column({ name: `NIVELCURSADO`, length: 50, nullable: true })
  nivelCursado: string;

  @Column({ name: `GRADOSEMESTRE`, length: 50, nullable: true })
  gradoSemestre: string;

  @Column({ name: `TRANSPORTESCOLAR`, nullable: true })
  transporteEscolar: boolean;

  @Column({ name: `ALIMENTACIESCOLAR`, nullable: true })
  alimentacionEscolar: boolean;

  @Column({ name: `JOVENENACCION`, nullable: true })
  jovenesEnAccion: boolean;

  @Column({ name: `FAMILIENACCION`, nullable: true })
  familiasEnAccion: boolean;

  @Column({ name: `CREDITICETEX`, nullable: true })
  creditoIcetex: boolean;

  @Column({ name: `REGIMENSALUD`, type: 'smallint', nullable: true })
  regimenSalud: number;

  @Column({ name: TABLE_NAMES.shared.general.eps, type: 'smallint', nullable: true })
  epsId: number;

  @Column({ name: `SITUACTUAL`, type: 'smallint', nullable: true })
  situacionActual: number;

  @Column({ name: `ROLEMPRESA`, type: 'smallint', nullable: true })
  papelDesempeniadoEmpresa: number;
}
