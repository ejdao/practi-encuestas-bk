import { BadRequestException, Injectable } from '@nestjs/common';
import { FetchPermisoRes } from '@gen/seguridad/application/responses';
import { BaseSource } from '@common/infrastructure/services';
import { RSA_SERVICES } from '@common/application/services';
import { TABLE_NAMES } from '@common/application/constants';
import { RolOrm, UsuarioOrm } from '@orm/general/auth';
import { PermisoOrm } from '@orm/general/seguridad';

@Injectable()
export class PermisosServicesImpl extends BaseSource {
  public async fetchByUsuario(id: string): Promise<FetchPermisoRes> {
    try {
      const permisos = await this.fetchAuthoritiesByUsuario(
        RSA_SERVICES.decryptId(id),
        this.auth.context
      );

      return permisos;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async addPermisoToUsuario(permisoId: string, usuarioId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);

      const permisoIdDcd = RSA_SERVICES.decryptId(permisoId);
      const usuarioIdDcd = RSA_SERVICES.decryptId(usuarioId);

      await this.verifyEntityExist(TABLE_NAMES.general.seguridad.permisos, permisoIdDcd);
      await this.verifyEntityExist(TABLE_NAMES.general.usuarios, usuarioIdDcd);

      const permiso = await permisoRp.findOne({ where: { id: permisoIdDcd } });
      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDcd },
        relations: ['permisos'],
      });

      usuario.permisos.push(permiso);

      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();

      return true;
    } catch (error) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async removePermisoToUsuario(permisoId: string, usuarioId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const usuarioRp = this.qr.manager.getRepository(UsuarioOrm);

      const permisoIdDcd = RSA_SERVICES.decryptId(permisoId);
      const usuarioIdDcd = RSA_SERVICES.decryptId(usuarioId);

      await this.verifyEntityExist(TABLE_NAMES.general.seguridad.permisos, permisoIdDcd);
      await this.verifyEntityExist(TABLE_NAMES.general.usuarios, usuarioIdDcd);

      const permisoToRemove = await permisoRp.findOne({ where: { id: permisoIdDcd } });
      const usuario = await usuarioRp.findOne({
        where: { id: usuarioIdDcd },
        relations: ['permisos'],
      });

      usuario.permisos = usuario.permisos.filter(authority => {
        return authority.id !== permisoToRemove.id;
      });

      await usuarioRp.save(usuario);

      await this.qr.commitTransaction();

      return true;
    } catch (error) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async addPermisoToRol(permisoId: string, rolId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const rolRp = this.qr.manager.getRepository(RolOrm);

      const permisoIdDcd = RSA_SERVICES.decryptId(permisoId);
      const rolIdDcd = RSA_SERVICES.decryptId(rolId);

      await this.verifyEntityExist(TABLE_NAMES.general.seguridad.permisos, permisoIdDcd);
      await this.verifyEntityExist(TABLE_NAMES.general.roles, rolIdDcd);

      const permiso = await permisoRp.findOne({ where: { id: permisoIdDcd } });
      const rol = await rolRp.findOne({ where: { id: rolIdDcd }, relations: ['permisos'] });

      rol.permisos.push(permiso);

      await rolRp.save(rol);

      await this.qr.commitTransaction();

      return true;
    } catch (error) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }

  public async removePermisoToRol(permisoId: string, rolId: string): Promise<boolean> {
    await this.qr.connect();
    try {
      await this.qr.startTransaction();

      const permisoRp = this.qr.manager.getRepository(PermisoOrm);
      const rolRp = this.qr.manager.getRepository(RolOrm);

      const permisoIdDcd = RSA_SERVICES.decryptId(permisoId);
      const rolIdDcd = RSA_SERVICES.decryptId(rolId);

      await this.verifyEntityExist(TABLE_NAMES.general.seguridad.permisos, permisoIdDcd);
      await this.verifyEntityExist(TABLE_NAMES.general.roles, rolIdDcd);

      const permisoToRemove = await permisoRp.findOne({ where: { id: permisoIdDcd } });
      const rol = await rolRp.findOne({ where: { id: rolIdDcd }, relations: ['permisos'] });

      rol.permisos = rol.permisos.filter(authority => {
        return authority.id !== permisoToRemove.id;
      });

      await rolRp.save(rol);

      await this.qr.commitTransaction();

      return true;
    } catch (error) {
      await this.qr.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await this.qr.release();
    }
  }
}
