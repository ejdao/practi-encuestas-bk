import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { EncuestadoOrm } from './encuestado.orm';

@Entity(TABLE_NAMES.encuestas.caracterizacionHogar)
export class EncCaracterizacionHogarOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @ManyToOne(() => EncuestadoOrm, encuestado => encuestado.caracterizacionHogar)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.encuestados, referencedColumnName: 'id' }])
  encuestado: EncuestadoOrm;

  @Column({ name: TABLE_NAMES.encuestas.encuestados, nullable: true })
  encuestadoId: number;

  @Column({ name: 'TENENVIVI', type: 'smallint', nullable: true })
  tenenciaViviendaCode: number;

  @Column({ name: 'RECISUBVIVI', nullable: true })
  recibioSubsidioVivienda: boolean;

  @Column({ name: 'FAMPOSETIER', nullable: true })
  familiaPoseeTierras: boolean;

  @Column({ name: 'TIERTIESCRREG', nullable: true })
  tierraTieneEscrituraRegistrada: boolean;

  @Column({ name: 'FAMINCLPROYDUC', nullable: true })
  familiaIncluidaProyectosProductivos: boolean;

  @Column({ name: 'TIPROYECTO', length: 500, nullable: true })
  tipoProyecto: string;

  @Column({ name: 'CANTIPERNUCLOGAR', type: 'smallint', nullable: true })
  cantidadPersonasNucleoHogar: number;

  @Column({ name: 'CANTIDORMITO', type: 'smallint', nullable: true })
  cantidadDormitorios: number;

  @Column({ name: 'CANTINUMECTAR', type: 'smallint', nullable: true })
  numeroHectareas: number;

  @Column({ name: TABLE_NAMES.shared.ubicacion.paises, type: 'smallint', nullable: true })
  paisId: number;

  @Column({ name: TABLE_NAMES.shared.ubicacion.departamentos, type: 'int', nullable: true })
  departamentoId: number;

  @Column({ name: TABLE_NAMES.shared.ubicacion.municipios, type: 'int', nullable: true })
  municipioId: number;

  @Column({ name: TABLE_NAMES.shared.ubicacion.corregimientos, type: 'int', nullable: true })
  localidadId: number;

  @Column({ name: 'BARRIO', length: 500, nullable: true })
  barrio: string;

  @Column({ name: 'DIRECCION', length: 100, nullable: true })
  direccion: string;

  @Column({ name: 'NUMTELEFO', length: 10, nullable: true })
  numeroTelefono: string;
}
