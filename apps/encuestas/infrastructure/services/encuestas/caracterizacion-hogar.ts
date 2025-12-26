import { Injectable } from '@nestjs/common';
import { EvaluacionesBaseSource } from '../_base';
import { EncuestadoOrm } from '@orm/encuestas';
import { CARACTERIZACION_HOGAR_KEY_IDS, ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { EncuestaOrm, RespuestaOrm } from '@orm/encuestas';
import { RespuestaPayload } from '@enc/application/payloads';
import { STRING_UTILITIES } from '@common/application/services';
import { TIPOS_DOCUMENTO } from '@ctypes/general/usuario';
import { PARENTEZCOS } from '@ctypes/encuestas';

@Injectable()
export class CaracterizacionHogarImpl extends EvaluacionesBaseSource {
  public async storeRespuestas(data: RespuestaPayload[]): Promise<boolean> {
    const dataFt = await this.verificarRespuestas(ENCUESTAS_KEY_IDS.caracterizacionHogar, data);

    let transaccionStarted = false;
    try {
      const cedulaEncuestado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.documento.numero
      );
      const nombreEncuestado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.nombreCompleto
      );
      const direccionEncuestado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.direccion
      );
      const telefonoEncuestado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.numeroTelefono
      );

      if (!cedulaEncuestado.length) throw new Error('No existe cedula del encuestado');
      if (!nombreEncuestado.length) throw new Error('No existe nombre del encuestado');

      await this.qr.connect();
      await this.qr.startTransaction();

      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);
      const evaluacionRp = this.qr.manager.getRepository(EncuestaOrm);
      const respuestaRp = this.qr.manager.getRepository(RespuestaOrm);

      const encuestado = await encuestadoRp.findOne({
        where: { numeroDocumento: cedulaEncuestado[0].respuesta as string },
      });

      if (encuestado) throw new Error('Ya existe un encuestado con esta cedula');

      const newEncuestado = new EncuestadoOrm();
      newEncuestado.nombreCompleto = STRING_UTILITIES.upperCaseAndTrim(
        nombreEncuestado[0].respuesta as string
      );
      newEncuestado.tipoDocumentoCode = TIPOS_DOCUMENTO.CEDULA_CIUDADANIA.getCode();
      newEncuestado.numeroDocumento = STRING_UTILITIES.trim(
        cedulaEncuestado[0].respuesta as string
      );
      newEncuestado.tieneLibretaMilitar = false;
      newEncuestado.direccion = STRING_UTILITIES.upperCaseAndTrim(
        direccionEncuestado[0].respuesta as string
      );
      newEncuestado.parentezcoCode = PARENTEZCOS.JEFE_HOGAR.getCode();
      newEncuestado.creadoPorId = this.auth.id;
      newEncuestado.numeroTelefono = telefonoEncuestado[0].respuesta as string;
      newEncuestado.fechaCreacion = new Date();

      let encuestadoStored = await encuestadoRp.save(newEncuestado);
      encuestadoStored.jefeHogarId = encuestadoStored.id;

      encuestadoStored = await encuestadoRp.save(newEncuestado);

      const newEvaluacion = new EncuestaOrm();
      newEvaluacion.encuestadoId = encuestadoStored.id;
      newEvaluacion.isAnulada = false;
      newEvaluacion.isCalificable = false;
      newEvaluacion.formatoId = ENCUESTAS_KEY_IDS.caracterizacionHogar;
      newEvaluacion.creadoPorId = this.auth.id;
      newEvaluacion.fechaCreacion = new Date();

      const evaluacionStored = await evaluacionRp.save(newEvaluacion);

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
}
