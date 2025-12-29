import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { EncuestadoOrm } from './encuestado.orm';

@Entity(TABLE_NAMES.encuestas.caracterizacionVivienda)
export class EncCaracterizacionViviendaOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @ManyToOne(() => EncuestadoOrm, encuestado => encuestado.caracterizacionHogar)
  @JoinColumn([{ name: TABLE_NAMES.encuestas.encuestados, referencedColumnName: 'id' }])
  encuestado: EncuestadoOrm;

  @Column({ name: TABLE_NAMES.encuestas.encuestados, nullable: true })
  encuestadoId: number;

  @Column({ name: 'DOCUACREDIPROPI', type: 'smallint', nullable: true })
  documentoAcreditaPropiedad: number;

  @Column({ name: 'TIPOVIVIENDA', type: 'smallint', nullable: true })
  tipoVivienda: number;

  @Column({ name: 'MATERIPISOS', type: 'smallint', nullable: true })
  materialPisos: number;

  @Column({ name: 'MATERIPAREDES', type: 'smallint', nullable: true })
  materialParedes: number;

  @Column({ name: 'MATERITECHO', type: 'smallint', nullable: true })
  materialTecho: number;

  @Column({ name: 'PRINCISERVSANITAR', type: 'smallint', nullable: true })
  principalServicioSanitario: number;

  @Column({ name: 'TIENERGIAELECTRI', nullable: true })
  tieneEnergiaElectrica: boolean;

  @Column({ name: 'TIENEACUEDUCTO', nullable: true })
  tieneAcueducto: boolean;

  @Column({ name: 'TIENEALCANTARILLADO', nullable: true })
  tieneAlcantarillado: boolean;

  @Column({ name: 'TIENEGASDOMICILIARIO', nullable: true })
  tieneGasDomiciliario: boolean;

  @Column({ name: 'TIENERECOLECBASURA', nullable: true })
  tieneRecoleccionBasura: boolean;
}
