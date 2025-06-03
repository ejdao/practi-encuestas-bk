import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ctmContextTypeFactory } from '@common/domain/types';
import { RSA_SERVICES } from '@common/application/services';
import { AuthToken } from '@common/application/services';
import { ENVIRONMENTS } from 'src/app.environments';
import { TokenOrm } from '@orm/general/seguridad';
import { switchConn } from 'src/app.connections';
import { UsuarioOrm } from '@orm/general/auth';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ActiveTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let usuario: UsuarioOrm;
    let isUpdatePassword: boolean;
    try {
      const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
      const url = context.getArgs()[0].url;
      isUpdatePassword = url.includes('auth/update-password') || url.includes('auth/data');
      const tokenDecoded: AuthToken = jwt.decode(token) as AuthToken;

      jwt.verify(token, ENVIRONMENTS.secretKey);

      const usuarioId = RSA_SERVICES.decryptId(tokenDecoded.id);
      const conn = switchConn(ctmContextTypeFactory(tokenDecoded.ctx));

      const usuarioRp = conn.getRepository(UsuarioOrm);
      const tokenRp = conn.getRepository(TokenOrm);

      const tokenFromBBDD = await tokenRp.findOne({ where: { usuarioId } });

      usuario = await usuarioRp.findOne({
        where: { id: usuarioId },
        select: { id: true, isPasswordReiniciada: true },
      });

      if (tokenFromBBDD.token !== token) {
        throw new Error('Ya cerró sesión con este token');
      } else if (usuario.isPasswordReiniciada && !isUpdatePassword) {
        throw new Error('Debe cambiar la contraseña ya que fue reiniciada recientemente');
      } else {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
