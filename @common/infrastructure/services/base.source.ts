import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { DataSource, QueryRunner } from 'typeorm';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SERVICES } from '@common/application/services';
import { CtmContextType } from '@common/domain/types';
import { switchConn } from 'src/app.connections';

@Injectable()
export class BaseSource {
  protected conn: DataSource;
  protected qr: QueryRunner;

  constructor(@Inject(REQUEST) private _request: Request) {
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
}
