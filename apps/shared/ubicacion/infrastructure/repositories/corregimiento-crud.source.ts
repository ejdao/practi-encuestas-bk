import { Injectable } from '@nestjs/common';
import { CorregimientoRes } from '@srd/ubicacion/application/responses';
import { CorregimientoOrm, DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { STRING_UTILITIES } from '@common/application/services';
import { UBICACION_FACTORIES } from '../factories';
import { UbicacionBaseSource } from '../bases';
import { Raw } from 'typeorm';

@Injectable()
export class CorregimientoCrudSource extends UbicacionBaseSource {
  public async fetch(municipioId: number, pattern: string): Promise<CorregimientoRes[]> {
    const corregimientoRp = this.conn.getRepository(CorregimientoOrm);
    const departamentoRp = this.conn.getRepository(DepartamentoOrm);
    const municipioRp = this.conn.getRepository(MunicipioOrm);

    const municipio = await municipioRp.findOne({ where: { id: municipioId } });
    const departamento = await departamentoRp.findOne({ where: { id: municipio.departamentoId } });

    const corregimientos = await corregimientoRp.find({
      where: pattern
        ? {
            municipioId,
            nombre: Raw(
              nombre => `LOWER(${nombre}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`
            ),
          }
        : { municipioId },
      take: pattern ? 5 : undefined,
    });

    return corregimientos.map(m =>
      UBICACION_FACTORIES.corregimientoOrmToRes(m, `${departamento.codigo}${municipio.codigo}`)
    );
  }
}
