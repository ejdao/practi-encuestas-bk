import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { MunicipioOrm } from './municipio.orm';

@Entity(TABLE_NAMES.shared.ubicacion.corregimientos)
export class CorregimientoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'TIPO', length: 2 })
  tipo: string;

  @Column({ name: 'LATITUD', type: 'double precision', nullable: true })
  latitud: number;

  @Column({ name: 'LONGITUD', type: 'double precision', nullable: true })
  longitud: number;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: TABLE_NAMES.shared.ubicacion.municipios })
  municipioId: number;

  @ManyToOne(() => MunicipioOrm, municipios => municipios.corregimientos)
  @JoinColumn({ name: TABLE_NAMES.shared.ubicacion.municipios })
  municipio: MunicipioOrm;
}
