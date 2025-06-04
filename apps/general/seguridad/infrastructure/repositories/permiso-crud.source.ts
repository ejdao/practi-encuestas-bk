import { IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FetchPermisoRes, ModuloBasicoRes } from '@gen/seguridad/application/responses';
import { RSA_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { CreatePermisoDto } from '@gen/seguridad/application/dtos';
import { permisoOrmToModuloBasicoResFactory } from '../factories';
import { CTM_LOGIC_CONTEXTS_VALUES } from '@common/domain/types';
import { BaseSource } from '@common/infrastructure/services';
import { TABLE_NAMES } from '@common/application/constants';
import { PermisoOrm } from '@orm/general/seguridad';

@Injectable()
export class PermisosCrudSource extends BaseSource {
  public async fetch(): Promise<FetchPermisoRes> {
    try {
      const result = await this.fetchAuthorities(this.auth.context);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async create(body: CreatePermisoDto): Promise<ModuloBasicoRes> {
    body.nombre = STRING_UTILITIES.upperCaseAndTrim(body.nombre);
    const { nombre, moduloId, subModuloId } = body;
    let failMsg = '';
    let permisoForThisBBDD: PermisoOrm;
    for (let index = 0; index < CTM_LOGIC_CONTEXTS_VALUES.length; index++) {
      const ctx = CTM_LOGIC_CONTEXTS_VALUES[index];
      const qr = this.dynamicQR(ctx);
      await qr.connect();
      await qr.startTransaction();
      try {
        const permisoRp = qr.manager.getRepository(PermisoOrm);

        const modIdDecrypt = moduloId ? RSA_SERVICES.decryptId(moduloId) : null;
        const subModIdDecrypt = subModuloId ? RSA_SERVICES.decryptId(subModuloId) : null;

        await this.verifyEntityExist(TABLE_NAMES.general.seguridad.modulos, modIdDecrypt, qr);
        await this.verifyEntityExist(TABLE_NAMES.general.seguridad.subModulos, subModIdDecrypt, qr);

        const conditions = {
          nombre,
          moduloId: modIdDecrypt ? modIdDecrypt : IsNull(),
          subModuloId: subModIdDecrypt ? modIdDecrypt : IsNull(),
        };

        const permisoConMismoNombre = await permisoRp.find({
          where: conditions,
        });

        if (permisoConMismoNombre.length) throw new Error('Ya existe un permiso con este nombre');

        delete conditions.nombre;

        const ultimoPermiso = await permisoRp.find({
          where: conditions,
          order: { id: 'desc' },
          take: 1,
        });

        const newCodigoPermiso = ultimoPermiso.length ? +ultimoPermiso[0].codigo + 1 : 1;
        const zeros = newCodigoPermiso <= 9 ? '00' : newCodigoPermiso <= 99 ? '0' : '';

        const newPermiso = new PermisoOrm();
        newPermiso.codigo = `${zeros}${newCodigoPermiso}`;
        newPermiso.isActivo = ctx.getCode() === this.auth.context.getCode() ? true : false;
        newPermiso.moduloId = modIdDecrypt;
        newPermiso.subModuloId = subModIdDecrypt;
        newPermiso.nombre = nombre;

        const permisoStored = await permisoRp.save(newPermiso);
        permisoStored.id = RSA_SERVICES.encryptId(permisoStored.id) as any;

        if (ctx === this.auth.context) {
          delete permisoStored.isActivo;
          delete permisoStored.moduloId;
          delete permisoStored.subModuloId;
          delete permisoStored.isFromRol;
          delete permisoStored.isFromUsuario;
          permisoForThisBBDD = permisoStored;
        }

        await qr.commitTransaction();
      } catch (error) {
        failMsg += ` ${ctx.getCode()} (${error.message}).`;
        await qr.rollbackTransaction();
      } finally {
        await qr.release();
      }
    }

    if (failMsg) throw new Error(`El registró falló en ${failMsg}`);
    else return permisoOrmToModuloBasicoResFactory(permisoForThisBBDD);
  }
}
