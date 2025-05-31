import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { MunicipioOrm } from './municipio.orm';
import { PaisOrm } from './pais.orm';

@Entity(TABLE_NAMES.shared.ubicacion.departamentos)
export class DepartamentoOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 2 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: TABLE_NAMES.shared.ubicacion.paises })
  paisId: number;

  @ManyToOne(() => PaisOrm, pais => pais.departamentos)
  @JoinColumn({ name: TABLE_NAMES.shared.ubicacion.paises })
  pais: PaisOrm;

  @OneToMany(() => MunicipioOrm, municipio => municipio.departamento)
  municipios: MunicipioOrm[];
}
