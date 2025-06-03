import { CYPTO_SERVICES, decryptValueFromFront, JWT_SERVICES } from '@common/application/services';
import { ESTADO_USUARIO, estadoUsuarioTypeFactory } from '@ctypes/general/usuario';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ctmContextTypeFactory } from '@common/domain/types';
import { LoginRes } from '@auth/application/responses';
import { LoginDto } from '@auth/application/dtos';
import { TokenOrm } from '@orm/general/seguridad';
import { switchConn } from 'src/app.connections';
import { UsuarioOrm } from '@orm/general/auth';
import { QueryRunner } from 'typeorm';

@Injectable()
export class LoginUserImpl {
  public async execute(payload: LoginDto): Promise<LoginRes> {
    payload.password = decryptValueFromFront(payload.password);
    payload.username = decryptValueFromFront(payload.username);

    const wrongCredentialsMsg = 'Usuario/correo y/o clave incorrecta';

    const { username, password, context } = payload;
    const ctx = ctmContextTypeFactory(payload.context);

    let qr: QueryRunner;

    try {
      const conn = switchConn(ctx);
      qr = conn.createQueryRunner();

      await qr.connect();

      await qr.startTransaction();

      const usuarioRp = qr.manager.getRepository(UsuarioOrm);
      const tokenRp = qr.manager.getRepository(TokenOrm);

      const usuario = await usuarioRp.findOne({
        where: [{ documento: username }, { email: username }],
        select: {
          id: true,
          password: true,
          documento: true,
          ultimoAcceso: true,
          estadoCode: true,
          isPasswordReiniciada: true,
        },
      });

      if (!usuario) throw new Error(wrongCredentialsMsg);

      const userStatus = estadoUsuarioTypeFactory(usuario.estadoCode);

      if (userStatus !== ESTADO_USUARIO.ACTIVO) {
        throw new Error(`Su usuario está en estado ${userStatus.getForHumans()}`);
      }

      const matchingPasswords = await CYPTO_SERVICES.compare(password, usuario.password);

      if (matchingPasswords) {
        const token = JWT_SERVICES.generate({
          usuarioId: usuario.id,
          isPasswordReiniciada: usuario.isPasswordReiniciada,
          documento: usuario.documento,
          context: ctx,
        });

        usuario.ultimoAcceso = new Date();
        await usuarioRp.save(usuario);

        let newToken: TokenOrm;
        newToken = await tokenRp.findOne({ where: { usuarioId: usuario.id } });
        if (!newToken) {
          newToken = new TokenOrm();
          newToken.usuarioId = usuario.id;
        }
        newToken.token = token;
        newToken.ultimoAcceso = new Date();
        await tokenRp.save(newToken);

        await qr.commitTransaction();

        return { token };
      } else {
        throw new Error(wrongCredentialsMsg);
      }
    } catch (error) {
      if (qr) await qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (qr) await qr.release();
    }
  }
}
