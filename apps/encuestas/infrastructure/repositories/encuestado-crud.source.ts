import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import {
  encuestadoOrmToEncuestadoForQueryFactory,
  encuestadoOrmToEncuestadoResFactory,
} from '../factories';
import { BaseSource } from '@common/infrastructure/services';
import { EncuestadoOrm, FormatoOrm, OpcionOrm, PreguntaOrm } from '@orm/encuestas';
import { ParentezcoCode, PARENTEZCOS } from '@ctypes/encuestas';
import { CorregimientoOrm, DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { EpsOrm } from '@orm/shared/general';

@Injectable()
export class EncuestadoCrudSource extends BaseSource {
  public async fetch(
    pattern?: string,
    parentezcoCode?: ParentezcoCode,
    onlyCreatedByMe?: boolean,
    forComplement?: boolean
  ) {
    try {
      const creadoPorId = onlyCreatedByMe ? this.auth.id : undefined;

      const encuestadoRp = this.conn.getRepository(EncuestadoOrm);

      const encuestados = await encuestadoRp.find({
        where: pattern
          ? [
              { nombreCompleto: Like(`%${pattern}%`), parentezcoCode, creadoPorId },
              { numeroDocumento: Like(`%${pattern}%`), parentezcoCode, creadoPorId },
            ]
          : { parentezcoCode, creadoPorId },
        relations: ['creadoPor', 'jefeHogar', 'caracterizacionVivienda', 'familiares'],
        take: forComplement ? 5 : undefined,
        order: forComplement ? { id: 'desc' } : undefined,
      });

      return encuestados.map(e => encuestadoOrmToEncuestadoResFactory(e));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async fetchForQuery() {
    try {
      const encuestadoRp = this.conn.getRepository(EncuestadoOrm);
      const preguntaRp = this.conn.getRepository(PreguntaOrm);
      const formatoRp = this.conn.getRepository(FormatoOrm);
      const departamentoRp = this.conn.getRepository(DepartamentoOrm);
      const municipioRp = this.conn.getRepository(MunicipioOrm);
      const corregimientoRp = this.conn.getRepository(CorregimientoOrm);
      const opcionRp = this.conn.getRepository(OpcionOrm);
      const epsRp = this.sharedConn.getRepository(EpsOrm);

      const encuestados = await encuestadoRp.find({
        where: { parentezcoCode: PARENTEZCOS.JEFE_HOGAR.getCode() },
        relations: [
          'creadoPor',
          'encuestas',
          'encuestas.respuestas',
          'familiares',
          'familiares.encuestas',
          'familiares.encuestas.respuestas',
        ],
      });

      const preguntas = await preguntaRp.find();
      const formatos = await formatoRp.find();
      const departamentos = await departamentoRp.find();
      const municipios = await municipioRp.find();
      const corregimientos = await corregimientoRp.find();
      const opciones = await opcionRp.find();
      const eps = await epsRp.find();

      encuestados.map(encuestado => {
        encuestado.familiares = encuestado.familiares.filter(f => f.id !== encuestado.id);

        encuestado.familiares.map(f => {
          if (f.encuestas) {
            f.encuestas = f.encuestas.filter(c => !c.isAnulada);
            f.encuestas.map(c => {
              const fto = formatos.filter(p => p.id === c.formatoId)[0];
              c.formato = fto;
              if (c.respuestas) {
                c.respuestas.map(r => {
                  const pgta = preguntas.filter(p => p.id === r.preguntaId)[0];
                  r.pregunta = pgta;
                });
              }
            });
          }
        });

        if (encuestado.encuestas) {
          encuestado.encuestas = encuestado.encuestas.filter(c => !c.isAnulada);
          encuestado.encuestas.map(encuesta => {
            const fto = formatos.filter(p => p.id === encuesta.formatoId)[0];
            encuesta.formato = fto;
            if (encuesta.respuestas) {
              encuesta.respuestas.map(respuesta => {
                const pgta = preguntas.filter(p => p.id === respuesta.preguntaId)[0];
                respuesta.pregunta = pgta;
              });
            }
          });
        }
      });

      const payload = { departamentos, municipios, corregimientos, opciones, eps };

      return encuestados.map(e => encuestadoOrmToEncuestadoForQueryFactory(e, payload));
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
