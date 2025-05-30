import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { ZonaCode } from '@ctypes/general/ubicacion';
import { CorregimientoOrm } from './corregimiento.orm';
import { DepartamentoOrm } from './departamento.orm';

@Entity(TABLE_NAMES.general.ubicacion.municipios)
export class MunicipioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 40 })
  nombre: string;

  @Column({ name: 'ZONA' })
  zonaCode: ZonaCode;

  @Column({ name: TABLE_NAMES.general.ubicacion.departamentos })
  departamentoId: number;

  @ManyToOne(() => DepartamentoOrm, departamento => departamento.municipios)
  @JoinColumn({ name: TABLE_NAMES.general.ubicacion.departamentos })
  departamento: DepartamentoOrm;

  @OneToMany(() => CorregimientoOrm, corregimiento => corregimiento.municipio)
  corregimientos: CorregimientoOrm[];
}
