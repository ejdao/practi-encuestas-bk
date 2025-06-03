import { Raw } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaisRes } from '@gen/ubicacion/application/responses';
import { STRING_UTILITIES } from '@common/application/services';
import { UBICACION_FACTORIES } from '../factories';
import { PaisOrm } from '@orm/shared/ubicacion';
import { UbicacionBaseSource } from '../bases';

@Injectable()
export class PaisCrudSource extends UbicacionBaseSource {
  public async fetch(
    pattern: string,
    payload: { addDepartamentos: boolean; addMunicipios: boolean; addCorregimientos: boolean }
  ): Promise<PaisRes[]> {
    const relations = [];
    if (payload.addDepartamentos) relations.push('departamentos');
    if (payload.addMunicipios) relations.push('departamentos.municipios');
    if (payload.addCorregimientos) relations.push('departamentos.municipios.corregimientos');

    const paisRp = this.conn.getRepository(PaisOrm);
    const paises = await paisRp.find({
      where: pattern
        ? {
            nombre: Raw(
              nombre => `LOWER(${nombre}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`
            ),
          }
        : {},
      relations,
      take: pattern ? 5 : undefined,
    });

    return paises.map(p => UBICACION_FACTORIES.paisOrmToRes(p));
  }
}
