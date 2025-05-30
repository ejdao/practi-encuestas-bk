import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { MunicipioOrm } from './municipio.orm';

@Entity(TABLE_NAMES.general.ubicacion.corregimientos)
export class CorregimientoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: TABLE_NAMES.general.ubicacion.municipios })
  municipioId: number;

  @ManyToOne(() => MunicipioOrm, municipios => municipios.corregimientos)
  @JoinColumn({ name: TABLE_NAMES.general.ubicacion.municipios })
  municipio: MunicipioOrm;
}
