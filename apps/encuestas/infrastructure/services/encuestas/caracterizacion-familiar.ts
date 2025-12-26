import { Injectable } from '@nestjs/common';
import { EvaluacionesBaseSource } from '../_base';
import { EncuestadoOrm } from '@orm/encuestas';
import { CARACTERIZACION_FAMILIAR_KEY_IDS, ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { EncuestaOrm, RespuestaOrm } from '@orm/encuestas';
import { RespuestaPayload } from '@enc/application/payloads';
import { Respuesta } from '@enc/domain/entities';
import { Not } from 'typeorm';
import { ParentezcoCode, PARENTEZCOS } from '@ctypes/encuestas';
import { STRING_UTILITIES } from '@common/application/services';
import { TipoDocUsuarioCode } from '@ctypes/general/usuario';

@Injectable()
export class CaracterizacionFamiliarImpl extends EvaluacionesBaseSource {
  public async storeRespuestas(jefeHogarId: number, data: RespuestaPayload[]): Promise<boolean> {
    const dataFt = await this.verificarRespuestas(ENCUESTAS_KEY_IDS.caracterizacionFamiliar, data);
    let transaccionStarted = false;
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);
      const encuestaRp = this.qr.manager.getRepository(EncuestaOrm);
      const respuestaRp = this.qr.manager.getRepository(RespuestaOrm);

      const jefeHogar = await encuestadoRp.findOne({
        where: { id: jefeHogarId },
      });

      if (!jefeHogar) throw new Error('No existe encuestado con este id');
      if (jefeHogar.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()) {
        throw new Error('El encuestado no es un jefe de hogar');
      }

      const keys = this._generateKeys(dataFt);
      const numeroDocumento = STRING_UTILITIES.trim(keys.documento.numero);

      let familiar = await encuestadoRp.findOne({
        where: { numeroDocumento, jefeHogarId },
      });

      const existInOtraFamilia = await encuestadoRp.findOne({
        where: { numeroDocumento, jefeHogarId: Not(jefeHogarId) },
      });

      if (existInOtraFamilia) {
        throw new Error('El encuestado ya pertenece a otra familia');
      }

      if (!familiar) {
        familiar = new EncuestadoOrm();
        familiar.numeroDocumento = numeroDocumento;
      }

      if (!familiar || (familiar && familiar.id !== jefeHogar.id)) {
        familiar.direccion = jefeHogar.direccion;
        familiar.jefeHogarId = jefeHogar.id;
        familiar.parentezcoCode = keys.parentezcoCode;
      }

      familiar.nombres = STRING_UTILITIES.upperCaseAndTrim(keys.nombres);
      familiar.apellidos = STRING_UTILITIES.upperCaseAndTrim(keys.apellidos);
      familiar.numeroTelefono = keys.numeroTelefono;
      familiar.nombreCompleto = `${familiar.nombres} ${familiar.apellidos}`;
      familiar.tipoDocumentoCode = keys.documento.tipoCode;
      familiar.tieneLibretaMilitar = keys.tieneLibretaMilitar;
      familiar.creadoPorId = this.auth.id;
      familiar.fechaCreacion = new Date();
      familiar.fechaNacimiento = keys.fechaNacimiento;

      const newFamiliar = await encuestadoRp.save(familiar);

      const encuestaAnterior = await encuestaRp.findOne({
        where: {
          encuestadoId: newFamiliar.id,
          formatoId: ENCUESTAS_KEY_IDS.caracterizacionFamiliar,
        },
      });

      if (encuestaAnterior) {
        const respuestasAnteriores = await respuestaRp.find({
          where: {
            encuestaId: encuestaAnterior.id,
          },
        });
        if (respuestasAnteriores.length) await respuestaRp.remove(respuestasAnteriores);
      }

      if (encuestaAnterior) await encuestaRp.remove(encuestaAnterior);

      const newEvaluacion = new EncuestaOrm();
      newEvaluacion.encuestadoId = newFamiliar.id;
      newEvaluacion.isAnulada = false;
      newEvaluacion.isCalificable = false;
      newEvaluacion.formatoId = ENCUESTAS_KEY_IDS.caracterizacionFamiliar;
      newEvaluacion.creadoPorId = this.auth.id;
      newEvaluacion.fechaCreacion = new Date();

      const evaluacionStored = await encuestaRp.save(newEvaluacion);

      const respuestas: RespuestaOrm[] = [];

      dataFt.forEach(d => {
        const r = new RespuestaOrm();
        r.encuestaId = evaluacionStored.id;
        r.preguntaId = d.pregunta.id;
        r.respuesta =
          [undefined, null, ''].indexOf(d.respuesta as any) >= 0
            ? null
            : STRING_UTILITIES.trim(
                `${typeof d.respuesta === 'boolean' ? (d.respuesta === true ? 1 : 0) : d.respuesta}`
              );
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

  private _generateKeys(data: Respuesta[]) {
    const nombres = data.filter(r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.nombres)[0];
    const apellidos = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.apellidos
    )[0];
    const tipoDocumento = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.documento.tipo
    )[0];
    const numeroDocumento = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.documento.numero
    )[0];
    const tieneLibretaMilitar = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.tieneLibretaMilitar
    )[0];
    const parentezco = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.parentezco
    )[0];
    const fechaNacimiento = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.fechaNacimiento
    )[0];
    const numeroTelefono = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.numeroTelefono
    )[0];

    return {
      nombres: nombres.respuesta as string,
      apellidos: apellidos.respuesta as string,
      documento: {
        tipoCode: tipoDocumento.respuesta as TipoDocUsuarioCode,
        numero: numeroDocumento.respuesta as string,
      },
      tieneLibretaMilitar: tieneLibretaMilitar.respuesta as boolean,
      parentezcoCode: parentezco.respuesta as ParentezcoCode,
      fechaNacimiento: new Date(fechaNacimiento.respuesta as string),
      numeroTelefono: numeroTelefono.respuesta as string,
    };
  }
}
