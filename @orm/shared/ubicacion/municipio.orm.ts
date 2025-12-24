import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { CorregimientoOrm } from './corregimiento.orm';
import { DepartamentoOrm } from './departamento.orm';
import { ZonaCode } from '@ctypes/shared/ubicacion';

@Entity(TABLE_NAMES.shared.ubicacion.municipios)
export class MunicipioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'ZONA' })
  zonaCode: ZonaCode;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: TABLE_NAMES.shared.ubicacion.departamentos })
  departamentoId: number;

  @ManyToOne(() => DepartamentoOrm, departamento => departamento.municipios)
  @JoinColumn({ name: TABLE_NAMES.shared.ubicacion.departamentos })
  departamento: DepartamentoOrm;

  @OneToMany(() => CorregimientoOrm, corregimiento => corregimiento.municipio)
  corregimientos: CorregimientoOrm[];
}
