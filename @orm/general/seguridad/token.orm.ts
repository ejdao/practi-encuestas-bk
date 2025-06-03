import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';
import { UsuarioOrm } from '../auth/usuario.orm';

@Entity(TABLE_NAMES.general.seguridad.tokens)
export class TokenOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'TOKEN', length: 500, nullable: true })
  token: string;

  @Column({ name: `ULTIACCESO` })
  ultimoAcceso: Date;

  @Column({ name: TABLE_NAMES.general.usuarios })
  usuarioId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.usuarios, referencedColumnName: 'id' }])
  usuario: UsuarioOrm;
}
