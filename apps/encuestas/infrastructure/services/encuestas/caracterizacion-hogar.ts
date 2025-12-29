import { Injectable } from '@nestjs/common';
import { EvaluacionesBaseSource } from '../_base';
import { EncCaracterizacionHogarOrm, EncuestadoOrm } from '@orm/encuestas';
import { CARACTERIZACION_HOGAR_KEY_IDS, ENCUESTAS_KEY_IDS } from '@enc/application/constants';
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
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.jefeHogarNumeroDocumento
      );
      const nombreEncuestado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.jefeHogarNombreCompleto
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

      const caractHogarRp = this.qr.manager.getRepository(EncCaracterizacionHogarOrm);
      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);

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

      const enc = new EncCaracterizacionHogarOrm();
      enc.encuestadoId = newEncuestado.id;
      enc.barrio = dataFt.filter(r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.barrio)[0]
        ?.respuesta as any;
      enc.cantidadDormitorios = +dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.cantidadDormitorios
      )[0]?.respuesta as any;
      enc.cantidadPersonasNucleoHogar = +dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.cantidadPersonasNucleoHogar
      )[0]?.respuesta as any;
      enc.departamentoId = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.departamentoId
      )[0]?.respuesta as any;
      enc.direccion = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.direccion
      )[0]?.respuesta as any;
      enc.familiaIncluidaProyectosProductivos = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.familiaIncluidaProyectosProductivos
      )[0]?.respuesta as any;
      enc.familiaPoseeTierras = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.familiaPoseeTierras
      )[0]?.respuesta as any;
      enc.localidadId = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.localidadId
      )[0]?.respuesta as any;
      enc.municipioId = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.municipioId
      )[0]?.respuesta as any;
      enc.numeroHectareas = +dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.numeroHectareas
      )[0]?.respuesta as any;
      enc.numeroTelefono = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.numeroTelefono
      )[0]?.respuesta as any;
      enc.paisId = 49;
      enc.recibioSubsidioVivienda = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.recibioSubsidioVivienda
      )[0]?.respuesta as any;
      enc.tenenciaViviendaCode = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.tenenciaViviendaCode
      )[0]?.respuesta as any;
      enc.tierraTieneEscrituraRegistrada = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.tierraTieneEscrituraRegistrada
      )[0]?.respuesta as any;
      enc.tipoProyecto = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_HOGAR_KEY_IDS.tipoProyecto
      )[0]?.respuesta as any;

      await caractHogarRp.save(enc);

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
