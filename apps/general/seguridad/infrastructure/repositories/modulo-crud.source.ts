import { Injectable } from '@nestjs/common';
import { FetchModuloRes, OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';
import { idToOnlyIdFromEntityResFactory, moduloOrmToFetchModuloResFactory } from '../factories';
import { CreateModuloDto } from '@gen/seguridad/application/dtos';
import { BaseSource } from '@common/infrastructure/services';
import { ModuloOrm } from '@orm/general/seguridad';
import { RSA_SERVICES, STRING_UTILITIES } from '@common/application/services';
import { CTM_LOGIC_CONTEXTS_VALUES } from '@common/domain/types';

@Injectable()
export class ModulosCrudSource extends BaseSource {
  public async fetch(): Promise<FetchModuloRes[]> {
    try {
      const moduloRp = this.conn.getRepository(ModuloOrm);
      let modulos = await moduloRp.find({ relations: ['subModulos'] });

      modulos.map(el => {
        el.subModulos = el.subModulos.filter(sm => sm.isActivo);
      });

      modulos = modulos.filter(el => el.isActivo);

      modulos.map(el => {
        el.subModulos.map(sm => {
          delete sm.isActivo;
          delete sm.moduloId;
          sm.id = RSA_SERVICES.encryptId(sm.id);
        });
        delete el.isActivo;
        el.id = RSA_SERVICES.encryptId(el.id);
      });

      return modulos.map(m => moduloOrmToFetchModuloResFactory(m));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async create(body: CreateModuloDto): Promise<OnlyIdFromEntityRes> {
    body.nombre = STRING_UTILITIES.upperCaseAndTrim(body.nombre);
    let failMsg = '';
    let moduloForThisBBDD: ModuloOrm;

    for (let index = 0; index < CTM_LOGIC_CONTEXTS_VALUES.length; index++) {
      const ctx = CTM_LOGIC_CONTEXTS_VALUES[index];
      const qr = this.dynamicQR(ctx);
      await qr.connect();
      await qr.startTransaction();
      try {
        body.nombre = body.nombre.trim();
        const moduloRp = qr.manager.getRepository(ModuloOrm);

        const moduloConMismoNombre = await moduloRp.find({
          where: { nombre: body.nombre },
        });

        if (moduloConMismoNombre.length) throw new Error('Ya existe un modulo con este nombre');

        const ultimoModulo = await moduloRp.find({ order: { id: 'desc' }, take: 1 });

        const newCodigoModulo = ultimoModulo.length ? +ultimoModulo[0].codigo + 1 : 1;
        const zeros = newCodigoModulo <= 9 ? '00' : newCodigoModulo <= 99 ? '0' : '';

        const newModulo = new ModuloOrm();
        newModulo.codigo = `${zeros}${newCodigoModulo}`;
        newModulo.isActivo = true;
        newModulo.nombre = body.nombre;

        const moduloStored = await moduloRp.save(newModulo);
        moduloStored.id = RSA_SERVICES.encryptId(moduloStored.id);

        if (ctx === this.auth.context) {
          delete moduloStored.isActivo;
          moduloForThisBBDD = moduloStored;
        }

        await qr.commitTransaction();
      } catch (error) {
        failMsg += ` ${ctx.getCode()},`;
        await qr.rollbackTransaction();
      } finally {
        await qr.release();
      }
    }

    if (failMsg) throw new Error(`El registró falló en ${failMsg}`);
    else {
      moduloForThisBBDD.id = RSA_SERVICES.encryptId(moduloForThisBBDD.id);
      return idToOnlyIdFromEntityResFactory(moduloForThisBBDD.id);
    }
  }
}
