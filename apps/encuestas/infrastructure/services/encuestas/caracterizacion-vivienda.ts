import { Injectable } from '@nestjs/common';
import { EvaluacionesBaseSource } from '../_base';
import { EncCaracterizacionViviendaOrm, EncuestadoOrm } from '@orm/encuestas';
import { CARACTERIZACION_VIVIENDA_KEY_IDS, ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { RespuestaPayload } from '@enc/application/payloads';
import { PARENTEZCOS } from '@ctypes/encuestas';

@Injectable()
export class CaracterizacionViviendaImpl extends EvaluacionesBaseSource {
  public async storeRespuestas(jefeHogarId: number, data: RespuestaPayload[]): Promise<boolean> {
    const dataFt = await this.verificarRespuestas(ENCUESTAS_KEY_IDS.caracterizacionVivienda, data);

    let transaccionStarted = false;
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);
      const caractViviendaRp = this.qr.manager.getRepository(EncCaracterizacionViviendaOrm);

      const encuestado = await encuestadoRp.findOne({
        where: { id: jefeHogarId },
      });

      if (!encuestado) throw new Error('No existe encuestado con este id');

      if (encuestado.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()) {
        throw new Error('El encuestado no es un jefe de hogar');
      }

      const viviendas = await caractViviendaRp.find({
        where: { encuestadoId: encuestado.id },
      });

      if (viviendas.length) {
        throw new Error('El encuestado solo puede tener una vivienda');
      }

      const enc = new EncCaracterizacionViviendaOrm();
      enc.encuestadoId = encuestado.id;
      enc.documentoAcreditaPropiedad = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.documentoAcreditaPropiedad
      )[0]?.respuesta as any;
      enc.materialParedes = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.materialParedes
      )[0]?.respuesta as any;
      enc.materialPisos = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.materialPisos
      )[0]?.respuesta as any;
      enc.materialTecho = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.materialTecho
      )[0]?.respuesta as any;
      enc.principalServicioSanitario = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.principalServicioSanitario
      )[0]?.respuesta as any;
      enc.tieneAcueducto = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tieneAcueducto
      )[0]?.respuesta as any;
      enc.tieneAlcantarillado = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tieneAlcantarillado
      )[0]?.respuesta as any;
      enc.tieneEnergiaElectrica = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tieneEnergiaElectrica
      )[0]?.respuesta as any;
      enc.tieneGasDomiciliario = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tieneGasDomiciliario
      )[0]?.respuesta as any;
      enc.tieneRecoleccionBasura = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tieneRecoleccionBasura
      )[0]?.respuesta as any;
      enc.tipoVivienda = dataFt.filter(
        r => r.pregunta.id === CARACTERIZACION_VIVIENDA_KEY_IDS.tipoVivienda
      )[0]?.respuesta as any;

      await caractViviendaRp.save(enc);

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
