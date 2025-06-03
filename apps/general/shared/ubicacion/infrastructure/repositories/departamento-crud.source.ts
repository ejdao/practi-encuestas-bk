import { Raw } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DepartamentoRes } from '@gen/ubicacion/application/responses';
import { STRING_UTILITIES } from '@common/application/services';
import { DepartamentoOrm } from '@orm/shared/ubicacion';
import { UBICACION_FACTORIES } from '../factories';
import { UbicacionBaseSource } from '../bases';

@Injectable()
export class DepartamentoCrudSource extends UbicacionBaseSource {
  public async fetch(
    paisId: number,
    pattern: string,
    payload: { addMunicipios: boolean; addCorregimientos: boolean }
  ): Promise<DepartamentoRes[]> {
    const relations = [];
    if (payload.addMunicipios) relations.push('municipios');
    if (payload.addCorregimientos) relations.push('municipios.corregimientos');

    const departamentoRp = this.conn.getRepository(DepartamentoOrm);

    const departamentos = await departamentoRp.find({
      where: pattern
        ? {
            paisId,
            nombre: Raw(
              nombre => `LOWER(${nombre}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`
            ),
          }
        : { paisId },
      relations,
      take: pattern ? 5 : undefined,
    });

    return departamentos.map(d => UBICACION_FACTORIES.departamentoOrmToRes(d, ''));
  }
}
