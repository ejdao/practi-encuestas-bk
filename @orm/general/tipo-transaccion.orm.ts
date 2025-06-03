import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TABLE_NAMES } from '@common/application/constants';

@Entity(TABLE_NAMES.general.tiposTransaccion)
export class TipoTransaccionOrm {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'smallint' })
  id: number;

  @Column({ name: 'CODIGO', length: 9 })
  codigo: string;

  @Column({ name: 'DESCRIPCION', length: 150 })
  descripcion: string;

  @Column({ name: 'TABLA', length: 20, nullable: true })
  tabla: string;
}
