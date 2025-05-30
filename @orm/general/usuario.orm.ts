import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { EstadoUsuarioCode, TipoDocUsuarioCode } from '@ctypes/general/usuario';
import { TABLE_NAMES } from '@common/application/constants';
import { PermisoOrm } from './seguridad/permiso.orm';
import { RolOrm } from './rol.orm';

@Entity(TABLE_NAMES.general.usuarios)
export class UsuarioOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'TIPODOC', type: 'smallint' })
  tipoDocumentoCode: TipoDocUsuarioCode;

  @Column({ name: 'DOCUME', length: 15 })
  documento: string;

  @Column({ name: 'PRINOMBRE', length: 100 })
  primerNombre: string;

  @Column({ name: 'SEGNOMBRE', length: 100, nullable: true })
  segundoNombre: string;

  @Column({ name: 'PRIAPELLIDO', length: 100, nullable: true })
  primerApellido: string;

  @Column({ name: 'SEGAPELLIDO', length: 100, nullable: true })
  segundoApellido: string;

  @Column({ name: 'NUMCEL', length: 15, nullable: true })
  numeroCelular: string;

  @Column({ name: 'EMAIL', length: 50, nullable: true })
  email: string;

  @Column({ name: 'CONTRA', length: 60, select: false })
  password: string;

  @Column({ name: `ULTIACCESO`, nullable: true })
  ultimoAcceso: Date;

  @Column({ name: 'ESTADO', type: 'smallint' })
  estadoCode: EstadoUsuarioCode;

  @Column({ name: 'PASSRESETED' })
  isPasswordReiniciada: boolean;

  @Column({ name: 'AUTHTOKEN', length: 500, nullable: true, select: false })
  authToken: string;

  @Column({ name: TABLE_NAMES.general.roles })
  rolId: number;

  @ManyToOne(() => RolOrm, role => role.usuarios)
  @JoinColumn({ name: TABLE_NAMES.general.roles })
  rol: RolOrm;

  @ManyToMany(() => PermisoOrm, permiso => permiso.usuarios)
  @JoinTable({
    name: TABLE_NAMES.general.seguridad.permisosUsuario,
    joinColumn: {
      name: TABLE_NAMES.general.usuarios,
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: TABLE_NAMES.general.seguridad.permisos,
      referencedColumnName: 'id',
    },
  })
  permisos: PermisoOrm[];
}
