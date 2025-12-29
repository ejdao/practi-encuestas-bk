import { Injectable } from '@nestjs/common';
import { EncuestadoOrm } from '@orm/encuestas';
import { EvaluacionesBaseSource } from '../_base';
import { CARACTERIZACION_FAMILIAR_KEY_IDS, ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { ParentezcoCode, PARENTEZCOS } from '@ctypes/encuestas';
import { STRING_UTILITIES } from '@common/application/services';
import { RespuestaPayload } from '@enc/application/payloads';
import { TipoDocUsuarioCode } from '@ctypes/general/usuario';
import { Respuesta } from '@enc/domain/entities';
import { Not } from 'typeorm';

@Injectable()
export class CaracterizacionFamiliarImpl extends EvaluacionesBaseSource {
  public async storeRespuestas(jefeHogarId: number, data: RespuestaPayload[]): Promise<boolean> {
    const dataFt = await this.verificarRespuestas(ENCUESTAS_KEY_IDS.caracterizacionFamiliar, data);
    let transaccionStarted = false;
    try {
      await this.qr.connect();
      await this.qr.startTransaction();

      const encuestadoRp = this.qr.manager.getRepository(EncuestadoOrm);

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
      familiar.sexo = +keys.sexo;
      familiar.etnia = +keys.etnia;
      familiar.esVictima = keys.esVictima as boolean;
      familiar.tipoDiscapacidad = keys.tipoDiscapacidad as number;
      familiar.programasSocialesEstado = keys.programasSocialesEstado as string;
      familiar.leeYEscribe = keys.leeYEscribe as boolean;
      familiar.ultimoTituloAcademico = +keys.ultimoTituloAcademico;
      familiar.actualMenteEstudia = keys.actualMenteEstudia as boolean;
      familiar.nivelCursado = keys.nivelCursado as string;
      familiar.gradoSemestre = keys.gradoSemestre as string;
      familiar.transporteEscolar = keys.transporteEscolar as boolean;
      familiar.alimentacionEscolar = keys.alimentacionEscolar as boolean;
      familiar.jovenesEnAccion = keys.jovenesEnAccion as boolean;
      familiar.familiasEnAccion = keys.familiasEnAccion as boolean;
      familiar.creditoIcetex = keys.creditoIcetex as boolean;
      familiar.regimenSalud = keys.regimenSalud as number;
      familiar.epsId = keys.epsId as number;
      familiar.situacionActual = keys.situacionActual as number;
      familiar.papelDesempeniadoEmpresa = keys.papelDesempeniadoEmpresa as number;

      await encuestadoRp.save(familiar);

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
    const tipoDocumentoCode = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.tipoDocumentoCode
    )[0];
    const numeroDocumento = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.numeroDocumento
    )[0];
    const tieneLibretaMilitar = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.tieneLibretaMilitar
    )[0];
    const parentezcoCode = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.parentezcoCode
    )[0];
    const fechaNacimiento = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.fechaNacimiento
    )[0];
    const numeroTelefono = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.numeroTelefono
    )[0];
    const sexo = data.filter(r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.sexo)[0]!;
    const etnia = data.filter(r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.etnia)[0]!;
    const esVictima = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.esVictima
    )[0]!;
    const tipoDiscapacidad = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.tipoDiscapacidad
    )[0]!;
    const programasSocialesEstado = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.programasSocialesEstado
    )[0]!;
    const leeYEscribe = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.leeYEscribe
    )[0]!;
    const ultimoTituloAcademico = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.ultimoTituloAcademico
    )[0]!;
    const actualMenteEstudia = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.actualMenteEstudia
    )[0]!;
    const nivelCursado = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.nivelCursado
    )[0]!;
    const gradoSemestre = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.gradoSemestre
    )[0]!;
    const transporteEscolar = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.transporteEscolar
    )[0]!;
    const alimentacionEscolar = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.alimentacionEscolar
    )[0]!;
    const jovenesEnAccion = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.jovenesEnAccion
    )[0]!;
    const familiasEnAccion = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.familiasEnAccion
    )[0]!;
    const creditoIcetex = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.creditoIcetex
    )[0]!;
    const regimenSalud = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.regimenSalud
    )[0]!;
    const eps = data.filter(r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.eps)[0]!;
    const situacionActual = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.situacionActual
    )[0]!;
    const papelDesempeniadoEmpresa = data.filter(
      r => r.pregunta.id === CARACTERIZACION_FAMILIAR_KEY_IDS.papelDesempeniadoEmpresa
    )[0]!;

    return {
      nombres: nombres.respuesta as string,
      apellidos: apellidos.respuesta as string,
      documento: {
        tipoCode: tipoDocumentoCode.respuesta as TipoDocUsuarioCode,
        numero: numeroDocumento.respuesta as string,
      },
      tieneLibretaMilitar: tieneLibretaMilitar.respuesta as boolean,
      parentezcoCode: parentezcoCode.respuesta as ParentezcoCode,
      fechaNacimiento: new Date(fechaNacimiento.respuesta as string),
      numeroTelefono: numeroTelefono.respuesta as string,
      sexo: sexo.respuesta,
      etnia: etnia.respuesta,
      esVictima: esVictima.respuesta,
      tipoDiscapacidad: tipoDiscapacidad.respuesta,
      programasSocialesEstado: programasSocialesEstado.respuesta,
      leeYEscribe: leeYEscribe.respuesta,
      ultimoTituloAcademico: ultimoTituloAcademico.respuesta,
      actualMenteEstudia: actualMenteEstudia.respuesta,
      nivelCursado: nivelCursado.respuesta,
      gradoSemestre: gradoSemestre.respuesta,
      transporteEscolar: transporteEscolar.respuesta,
      alimentacionEscolar: alimentacionEscolar.respuesta,
      jovenesEnAccion: jovenesEnAccion.respuesta,
      familiasEnAccion: familiasEnAccion.respuesta,
      creditoIcetex: creditoIcetex.respuesta,
      regimenSalud: regimenSalud.respuesta,
      epsId: eps.respuesta,
      situacionActual: situacionActual.respuesta,
      papelDesempeniadoEmpresa: papelDesempeniadoEmpresa.respuesta,
    };
  }
}
