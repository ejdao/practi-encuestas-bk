import { Injectable } from '@nestjs/common';
import { EvaluacionesBaseSource } from '../_base';
import { EncuestadoOrm } from '@orm/encuestas';
import { ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { EncuestaOrm, RespuestaOrm } from '@orm/encuestas';
import { RespuestaPayload } from '@enc/application/payloads';
import { PARENTEZCOS } from '@ctypes/encuestas';
import { STRING_UTILITIES } from '@common/application/services';

@Injectable()
export class CaracterizacionViviendaImpl extends EvaluacionesBaseSource {
  public async storeRespuestas(jefeHogarId: number, data: RespuestaPayload[]): Promise<boolean> {
    const dataFt = await this.verificarRespuestas(ENCUESTAS_KEY_IDS.caracterizacionVivienda, data);

    let transaccionStarted = false;
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);
      const evaluacionRp = this.qr.manager.getRepository(EncuestaOrm);
      const respuestaRp = this.qr.manager.getRepository(RespuestaOrm);

      const encuestado = await encuestadoRp.findOne({
        where: { id: jefeHogarId },
      });

      if (!encuestado) throw new Error('No existe encuestado con este id');

      if (encuestado.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()) {
        throw new Error('El encuestado no es un jefe de hogar');
      }

      const viviendas = await evaluacionRp.find({
        where: {
          encuestadoId: encuestado.id,
          formatoId: ENCUESTAS_KEY_IDS.caracterizacionVivienda,
        },
      });

      if (viviendas.length) {
        throw new Error('El encuestado solo puede tener una vivienda');
      }

      const newEvaluacion = new EncuestaOrm();
      newEvaluacion.encuestadoId = encuestado.id;
      newEvaluacion.isAnulada = false;
      newEvaluacion.isCalificable = false;
      newEvaluacion.formatoId = ENCUESTAS_KEY_IDS.caracterizacionVivienda;
      newEvaluacion.creadoPorId = this.auth.id;
      newEvaluacion.fechaCreacion = new Date();

      const evaluacionStored = await evaluacionRp.save(newEvaluacion);

      const respuestas: RespuestaOrm[] = [];

      dataFt.forEach(d => {
        const r = new RespuestaOrm();
        r.encuestaId = evaluacionStored.id;
        r.preguntaId = d.pregunta.id;
        r.respuesta =
          d.respuesta !== null
            ? STRING_UTILITIES.trim(
                `${typeof d.respuesta === 'boolean' ? (d.respuesta === true ? 1 : 0) : d.respuesta}`
              )
            : null;
        respuestas.push(r);
      });

      await respuestaRp.save(respuestas);

      await this.qr.commitTransaction();

      return true;
    } catch (error) {
      if (transaccionStarted) await this.qr.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      if (transaccionStarted) await this.qr.release();
    }
  }
}
