import { Injectable } from '@nestjs/common';
import { RSA_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';
import { CreateSubModuloDto } from '@gen/seguridad/application/dtos';
import { CTM_LOGIC_CONTEXTS_VALUES } from '@common/domain/types';
import { idToOnlyIdFromEntityResFactory } from '../factories';
import { BaseSource } from '@common/infrastructure/services';
import { TABLE_NAMES } from '@common/application/constants';
import { SubModuloOrm } from '@orm/general/seguridad';

@Injectable()
export class SubModulosCrudSource extends BaseSource {
  public async create(body: CreateSubModuloDto): Promise<OnlyIdFromEntityRes> {
    body.nombre = STRING_UTILITIES.upperCaseAndTrim(body.nombre);
    body.moduloId = RSA_SERVICES.decryptId(body.moduloId) as any;
    let failMsg = '';
    let subModuloForThisBBDD: SubModuloOrm;
    for (let index = 0; index < CTM_LOGIC_CONTEXTS_VALUES.length; index++) {
      const ctx = CTM_LOGIC_CONTEXTS_VALUES[index];
      const qr = this.dynamicQR(ctx);
      await qr.connect();
      await qr.startTransaction();
      try {
        body.nombre = body.nombre.trim();
        const subModuloRp = qr.manager.getRepository(SubModuloOrm);

        await this.verifyEntityExist(TABLE_NAMES.general.seguridad.modulos, +body.moduloId, qr);

        const subModuloConMismoNombre = await subModuloRp.find({
          where: { nombre: body.nombre, moduloId: +body.moduloId },
        });
        if (subModuloConMismoNombre.length) {
          throw new Error('Ya existe un subModulo con este nombre');
        }

        const lastSubModulo = await subModuloRp.find({
          where: { moduloId: +body.moduloId },
          order: { id: 'desc' },
          take: 1,
        });

        const newCodigoSubModulo = lastSubModulo.length ? +lastSubModulo[0].codigo + 1 : 1;
        const zeros = newCodigoSubModulo <= 9 ? '00' : newCodigoSubModulo <= 99 ? '0' : '';

        const newSubModulo = new SubModuloOrm();
        newSubModulo.codigo = `${zeros}${newCodigoSubModulo}`;
        newSubModulo.isActivo = true;
        newSubModulo.moduloId = +body.moduloId;
        newSubModulo.nombre = body.nombre;

        const subModuloStored = await subModuloRp.save(newSubModulo);

        if (ctx === this.auth.context) {
          delete subModuloStored.isActivo;
          delete subModuloStored.moduloId;
          subModuloForThisBBDD = subModuloStored;
        }

        await qr.commitTransaction();
      } catch (error) {
        failMsg += `${ctx.getCode()} (${error.message}). `;
        await qr.rollbackTransaction();
      } finally {
        await qr.release();
      }
    }

    if (failMsg) throw new Error(`El registró falló en ${failMsg}`);
    else return idToOnlyIdFromEntityResFactory(subModuloForThisBBDD.id, true);
  }
}
