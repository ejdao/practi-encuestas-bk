import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { PermisoOrm } from './permiso.orm';
import { ModuloOrm } from './modulo.orm';

@Entity(TABLE_NAMES.general.seguridad.subModulos)
export class SubModuloOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @Column({ name: 'ACTIVO' })
  isActivo: boolean;

  @Column({ name: TABLE_NAMES.general.seguridad.modulos })
  moduloId: number;

  @ManyToOne(() => ModuloOrm, module => module.permisos)
  @JoinColumn({ name: TABLE_NAMES.general.seguridad.modulos })
  modulo: ModuloOrm;

  @OneToMany(() => PermisoOrm, permiso => permiso.subModulo)
  permisos: PermisoOrm[];
}
