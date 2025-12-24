import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { UsuarioOrm } from '../auth/usuario.orm';
import { SubModuloOrm } from './sub-modulo.orm';
import { ModuloOrm } from './modulo.orm';
import { RolOrm } from '../auth/rol.orm';

@Entity(TABLE_NAMES.general.seguridad.permisos)
export class PermisoOrm {
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

  @Column({ name: TABLE_NAMES.general.seguridad.subModulos })
  subModuloId: number;

  @ManyToOne(() => ModuloOrm, modulo => modulo.permisos)
  @JoinColumn({ name: TABLE_NAMES.general.seguridad.modulos })
  modulo: ModuloOrm;

  @ManyToOne(() => SubModuloOrm, subModulo => subModulo.permisos)
  @JoinColumn({ name: TABLE_NAMES.general.seguridad.subModulos })
  subModulo: SubModuloOrm;

  @ManyToMany(() => RolOrm, rol => rol.permisos)
  roles: RolOrm[];

  @ManyToMany(() => UsuarioOrm, usuario => usuario.permisos)
  usuarios: UsuarioOrm[];

  isFromUsuario = false;
  isFromRol = false;
}
