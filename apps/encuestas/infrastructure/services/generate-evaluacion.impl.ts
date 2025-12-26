import { Injectable } from '@nestjs/common';
import { BaseSource } from '@common/infrastructure/services';
import { FormatoOrm } from '@orm/encuestas';
import { GenerateEncuestaRes } from '@enc/application/responses';
import { formatoOrmToGenerateEncuestaResFactory } from '../factories';

@Injectable()
export class GenerateEncuestaImpl extends BaseSource {
  public async execute(formatoId: number): Promise<GenerateEncuestaRes> {
    const formatoRp = this.conn.getRepository(FormatoOrm);
    const formato = await formatoRp.findOne({
      where: { id: formatoId },
      relations: ['preguntas', 'preguntas.opciones'],
    });

    formato.preguntas = formato.preguntas.filter(p => p.isActiva);

    formato.preguntas.map(p => {
      if (p.opciones) p.opciones = p.opciones.filter(o => o.isActiva);
    });

    return formatoOrmToGenerateEncuestaResFactory(formato);
  }
}
