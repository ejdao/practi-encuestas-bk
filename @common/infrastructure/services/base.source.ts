import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource, Entity, PrimaryGeneratedColumn, QueryRunner, Repository } from 'typeorm';
import { TipoTransaccionOrm, TransaccionOrm } from '@orm/general/transacciones';
import { JWT_SERVICES } from '@common/application/services';
import { AuthoritiesSource } from './authorities.source';
import { CtmContextType } from '@common/domain/types';
import { switchConn } from 'src/app.connections';
import { UsuarioOrm } from '@orm/general/auth';

@Entity('UNNAMED')
export class JustForVerifyOrm {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
}

@Injectable()
export class BaseSource extends AuthoritiesSource {
  protected conn: DataSource;
  protected qr: QueryRunner;

  constructor(@Inject(REQUEST) private _request: Request) {
    super();
    try {
      this.conn = switchConn(this.auth.context);
      this.qr = this.conn.createQueryRunner();
    } catch (error) {
      throw new UnauthorizedException('Requiere token de autenticación');
    }
  }

  protected dynamicConn(ctx: CtmContextType): DataSource {
    return switchConn(ctx);
  }

  protected dynamicQR(ctx: CtmContextType): QueryRunner {
    return switchConn(ctx).createQueryRunner();
  }

  protected async verifyEntityExist(tablePath: string, id: number, qr?: QueryRunner) {
    let rp: Repository<JustForVerifyOrm>;
    if (!qr) rp = this.conn.getRepository(JustForVerifyOrm);
    else rp = qr.manager.getRepository(JustForVerifyOrm);
    rp.metadata.tablePath = tablePath;
    const result = await rp.findOne({ where: { id } });
    if (!result) throw new Error(`No existe ${tablePath} con este id`);
  }

  protected get auth() {
    try {
      const tkDecoded = JWT_SERVICES.decode(this._request.headers.authorization.split(' ')[1]);

      const id = tkDecoded.getId();
      const document = tkDecoded.getDoument();
      const context = tkDecoded.getContext();

      return { id, document, context };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  protected async generateTransaccion(
    codigo: string,
    entidadRelacionadaId: number,
    qr: QueryRunner,
    informacionAdicional?: string
  ) {
    const usuarioRp = qr.manager.getRepository(UsuarioOrm);
    const transaccionRp = qr.manager.getRepository(TransaccionOrm);
    const tipoTransaccionRp = qr.manager.getRepository(TipoTransaccionOrm);

    const tipoTransaccion = await tipoTransaccionRp.findOne({ where: { codigo } });
    const usuario = await usuarioRp.findOne({ where: { documento: this.auth.document } });

    if (!usuario) throw new Error('No existe un usuario con su documento en este contexto');

    const newTransaccion = new TransaccionOrm();
    newTransaccion.entidadRelacionadaId = entidadRelacionadaId;
    newTransaccion.fechaCreacion = new Date();
    newTransaccion.tipoTransaccionId = tipoTransaccion.id;
    if (usuario) newTransaccion.usuarioId = usuario.id;
    if (informacionAdicional) {
      newTransaccion.informacionAdicional =
        informacionAdicional.length > 300
          ? `${informacionAdicional.slice(0, 297).trim()}...`
          : informacionAdicional;
    }

    await transaccionRp.save(newTransaccion);
  }
}
