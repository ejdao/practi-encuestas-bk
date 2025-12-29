import { Injectable } from '@nestjs/common';
import { SharedBaseSource } from '@shared/bases';
import { ApiProperty } from '@nestjs/swagger';
import { EpsOrm } from '@orm/shared/general';

export class EpsRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;
}

const EpsOrmToRes = (data: EpsOrm) => {
  const e = new EpsRes();
  e.id = data.id;
  e.codigo = data.nit;
  e.nombre = data.nombre;
  return e;
};

@Injectable()
export class FetchEpsImpl extends SharedBaseSource {
  public async execute(pattern: string): Promise<EpsRes[]> {
    const epsRp = this.conn.getRepository(EpsOrm);

    const eps = await epsRp.find({
      where: { nombre: this.like(pattern) },
      take: this.take(pattern),
    });

    return eps.map(d => EpsOrmToRes(d));
  }
}
