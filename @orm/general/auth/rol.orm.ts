import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { PermisoOrm } from '../seguridad/permiso.orm';
import { UsuarioOrm } from './usuario.orm';

@Entity(TABLE_NAMES.general.roles)
export class RolOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 3 })
  codigo: string;

  @Column({ name: 'NOMBRE', length: 50 })
  nombre: string;

  @OneToMany(() => UsuarioOrm, user => user.rol)
  usuarios: UsuarioOrm[];

  @ManyToMany(() => PermisoOrm, authority => authority.roles)
  @JoinTable({
    name: TABLE_NAMES.general.seguridad.permisosRol,
    joinColumn: { name: TABLE_NAMES.general.roles, referencedColumnName: 'id' },
    inverseJoinColumn: { name: TABLE_NAMES.general.seguridad.permisos, referencedColumnName: 'id' },
  })
  permisos: PermisoOrm[];
}
