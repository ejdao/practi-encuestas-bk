import { BadRequestException, Injectable } from '@nestjs/common';
import { CYPTO_SERVICES, JWT_SERVICES } from '@common/application/services';
import { BaseSource } from '@common/infrastructure/services';
import { MyAuthDataRes } from '@auth/application/responses';
import { TokenOrm } from '@orm/general/seguridad';
import { UsuarioOrm } from '@orm/general/auth';

@Injectable()
export class AuthServicesImpl extends BaseSource {
  public async logout(): Promise<boolean> {
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const tokenRp = this.qr.manager.getRepository(TokenOrm);
      const token = await tokenRp.findOne({ where: { usuarioId: this.auth.id } });
      token.token = null;
      await tokenRp.save(token);

      await this.qr.commitTransaction();
      return true;
    } catch (error) {
      this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async updatePassword(newPassword: string, wasReset: boolean): Promise<{ token: string }> {
    newPassword = CYPTO_SERVICES.decryptValueFromFront(newPassword);
    let transactionWasStarted = false;
    try {
      const minLength = 8;
      const maxLength = 20;

      if (newPassword.length < minLength) {
        throw new Error(`La cantidad de caracteres debe ser mayor a ${minLength} caracteres`);
      }

      if (newPassword.length > maxLength) {
        throw new Error(`La cantidad de caracteres debe ser menor a ${maxLength} caracteres`);
      }

      transactionWasStarted = true;

      await this.qr.connect();
      await this.qr.startTransaction();

      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);
      const tokenRp = this.qr.manager.getRepository(TokenOrm);

      const usuario = await usuarioRp.findOne({
        where: [{ id: this.auth.id }],
      });

      usuario.password = await CYPTO_SERVICES.encrypt(newPassword);
      usuario.isPasswordReiniciada = false;

      let token = '';

      if (wasReset) {
        const tokenFromBBDD = await tokenRp.findOne({ where: { usuarioId: usuario.id } });

        token = JWT_SERVICES.generate({
          usuarioId: usuario.id,
          isPasswordReiniciada: false,
          documento: usuario.documento,
          context: this.auth.context,
        });

        tokenFromBBDD.token = token;
        tokenFromBBDD.ultimoAcceso = new Date();
        await tokenRp.save(tokenFromBBDD);
      }

      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();

      return { token };
    } catch (error) {
      if (transactionWasStarted) this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      if (transactionWasStarted) await this.qr.release();
    }
  }

  public async data(): Promise<MyAuthDataRes> {
    const usuarioRp = this.conn.getRepository(UsuarioOrm);
    const usuario = await usuarioRp.findOne({ where: { id: this.auth.id } });

    const result = new MyAuthDataRes();
    result.documento = usuario.documento;
    result.nombreCompleto = usuario.getNombreCompleto();

    return result;
  }
}
