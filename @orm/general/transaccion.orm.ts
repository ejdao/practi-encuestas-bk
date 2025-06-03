import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoTransaccionOrm } from './tipo-transaccion.orm';
import { TABLE_NAMES } from '@common/application/constants';
import { UsuarioOrm } from './usuario.orm';

@Entity(TABLE_NAMES.general.transacciones)
export class TransaccionOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  id: number;

  @Column({ name: 'INFOADICIO', length: 300, nullable: true })
  informacionAdicional: string;

  @Column({ name: 'FECHREG' })
  fechaCreacion: Date;

  @Column({ name: 'ENTIRELACIO', type: 'int' })
  entidadRelacionadaId: number;

  @Column({ name: TABLE_NAMES.general.usuarios, nullable: true })
  usuarioId: number;

  @Column({ name: TABLE_NAMES.general.tiposTransaccion })
  tipoTransaccionId: number;

  @ManyToOne(() => UsuarioOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.usuarios, referencedColumnName: 'id' }])
  usuario: UsuarioOrm;

  @ManyToOne(() => TipoTransaccionOrm)
  @JoinColumn([{ name: TABLE_NAMES.general.tiposTransaccion, referencedColumnName: 'id' }])
  tipoTransaccion: TipoTransaccionOrm;
}
