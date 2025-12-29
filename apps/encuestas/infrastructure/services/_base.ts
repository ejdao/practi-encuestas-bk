import { Injectable } from '@nestjs/common';
import { Respuesta } from '@enc/domain/entities';
import { FormatoOrm, PreguntaOrm } from '@orm/encuestas';
import { BaseSource } from '@common/infrastructure/services';
import { RespuestaPayload } from '@enc/application/payloads';
import { TipoPreguntaType, tipoPreguntaTypeFactory, TIPOS_PREGUNTA } from '@ctypes/evaluaciones';
import { TABLE_NAMES } from '@common/application/constants';

@Injectable()
export class EvaluacionesBaseSource extends BaseSource {
  public async verificarRespuestas(
    formatoId: number,
    payload: RespuestaPayload[]
  ): Promise<Respuesta[]> {
    try {
      const formatoRp = this.conn.getRepository(FormatoOrm);

      const formato = await formatoRp.findOne({
        where: { id: formatoId, isActiva: true },
        relations: ['preguntas', 'preguntas.opciones'],
      });

      //this._validateCantidadPreguntas(formato.preguntas, payload);

      const respuestas = this._addPreguntaToPayload(formato.preguntas, payload);

      for (let index = 0; index < respuestas.length; index++) {
        const element = respuestas[index];
        //await this._validarRespuestas(element);
      }

      return respuestas;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private _validateCantidadPreguntas(preguntas: PreguntaOrm[], payload: RespuestaPayload[]): void {
    const cantidadPreguntas = preguntas.filter(
      p => p.tipoCode !== TIPOS_PREGUNTA.COMPLEMENTADA.getCode()
    ).length;
    if (cantidadPreguntas !== payload.length) {
      throw new Error(
        'La cantidad de respuestas enviadas no coincide con la cantidad de preguntas hechas'
      );
    }
  }

  private _addPreguntaToPayload(preguntas: PreguntaOrm[], payload: RespuestaPayload[]) {
    const response = payload.map(p => {
      if (Array.isArray(p.respuesta) && !p.respuesta.length) p.respuesta = null;
      if ([undefined, null, ''].indexOf(p.respuesta as any) >= 0) p.respuesta = null;
      const pregunta = preguntas.filter(pr => pr.id === p.preguntaId);
      const r = new Respuesta();
      if (pregunta.length) r.pregunta = pregunta[0];
      else throw new Error(`No existe pregunta con el id ${p.preguntaId}`);
      r.tipoPregunta = tipoPreguntaTypeFactory(r.pregunta.tipoCode);
      r.respuesta = p.respuesta;
      return r;
    });
    return response;
  }

  private async _validarRespuestas(rta: Respuesta) {
    const err = (tipo: TipoPreguntaType) =>
      `Una o mas respuestas no son del tipo adecuado: ${tipo.getForHumans()}`;
    /*  if (!rta.pregunta.isOpcional && rta.respuesta === null) {
      throw new Error(`Una o mas preguntas no son opcionales`);
    } */

    if (rta.respuesta !== null) {
      if (
        [TIPOS_PREGUNTA.ABIERTA_CORTA, TIPOS_PREGUNTA.ABIERTA_LARGA].indexOf(rta.tipoPregunta) >= 0
      ) {
        if (typeof rta.respuesta !== 'string') throw new Error(err(rta.tipoPregunta));
        if (
          rta.pregunta.limSelMultiOrCarac &&
          rta.respuesta.length > rta.pregunta.limSelMultiOrCarac
        ) {
          throw new Error(`La cantidad de caracteres de una de las respuesta supera su limite`);
        }
      }
      if (
        [TIPOS_PREGUNTA.ABIERTA_NUMERICO, TIPOS_PREGUNTA.VALOR_MONETARIO].indexOf(
          rta.tipoPregunta
        ) >= 0 &&
        typeof rta.respuesta !== 'number'
      ) {
        throw new Error(err(rta.tipoPregunta));
      }
      if ([TIPOS_PREGUNTA.SELECCION_UNICA].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.respuesta !== 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(TABLE_NAMES.encuestas.opciones, rta.respuesta);
      }
      if ([TIPOS_PREGUNTA.SELECCION_MULTIPLE].indexOf(rta.tipoPregunta) >= 0) {
        if (Array.isArray(rta.respuesta)) {
          for (let index = 0; index < rta.respuesta.length; index++) {
            const element = rta.respuesta[index];
            await this.verifyEntityExist(TABLE_NAMES.encuestas.opciones, element);
          }
        } else {
          throw new Error(err(rta.tipoPregunta));
        }
      }
      if (
        [TIPOS_PREGUNTA.SI_NO].indexOf(rta.tipoPregunta) >= 0 &&
        typeof rta.respuesta !== 'boolean'
      ) {
        throw new Error(err(rta.tipoPregunta));
      }
      if ([TIPOS_PREGUNTA.PAIS].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(TABLE_NAMES.shared.ubicacion.paises, rta.respuesta as number);
      }
      if ([TIPOS_PREGUNTA.DEPARTAMENTO].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(
          TABLE_NAMES.shared.ubicacion.departamentos,
          rta.respuesta as number
        );
      }
      if ([TIPOS_PREGUNTA.MUNICIPIO].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(
          TABLE_NAMES.shared.ubicacion.municipios,
          rta.respuesta as number
        );
      }
      if ([TIPOS_PREGUNTA.CORREGIMIENTO].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(
          TABLE_NAMES.shared.ubicacion.corregimientos,
          rta.respuesta as number
        );
      }
      if ([TIPOS_PREGUNTA.BARRIO_VEREDA].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(TABLE_NAMES.shared.ubicacion.barrios, rta.respuesta as number);
      }
      if ([TIPOS_PREGUNTA.BARRIO_VEREDA].indexOf(rta.tipoPregunta) >= 0) {
        if (typeof rta.tipoPregunta === 'number') {
          throw new Error(err(rta.tipoPregunta));
        }
        await this.verifyEntityExist(TABLE_NAMES.shared.ubicacion.barrios, rta.respuesta as number);
      }
    }
  }
}
