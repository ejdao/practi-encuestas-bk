import { Raw } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MunicipioRes } from '@gen/ubicacion/application/responses';
import { DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { STRING_UTILITIES } from '@common/application/services';
import { UBICACION_FACTORIES } from '../factories';
import { UbicacionBaseSource } from '../bases';

@Injectable()
export class MunicipioCrudSource extends UbicacionBaseSource {
  public async fetch(
    departamentoId: number,
    pattern: string,
    payload: { addCorregimientos: boolean }
  ): Promise<MunicipioRes[]> {
    const relations = [];
    if (payload.addCorregimientos) relations.push('corregimientos');
    const departamentoRp = this.conn.getRepository(DepartamentoOrm);
    const municipioRp = this.conn.getRepository(MunicipioOrm);

    const departamento = await departamentoRp.findOne({ where: { id: departamentoId } });

    const municipios = await municipioRp.find({
      where: pattern
        ? {
            departamentoId,
            nombre: Raw(
              nombre => `LOWER(${nombre}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`
            ),
          }
        : { departamentoId },
      relations,
      take: pattern ? 5 : undefined,
    });

    return municipios.map(m => UBICACION_FACTORIES.municipioOrmToRes(m, departamento.codigo));
  }
}
