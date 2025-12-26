import { cloneDeep, orderBy } from 'lodash';
import {
  EncuestadoRes,
  GenerateEncuestaRes,
  OpcionRes,
  PreguntaRes,
} from '@enc/application/responses';
import { EncuestadoOrm, FormatoOrm, OpcionOrm, PreguntaOrm } from '@orm/encuestas';
import { UsuarioBasicoRes } from '@common/application/responses';
import { ENCUESTAS_KEY_IDS } from '@enc/application/constants';
import { CorregimientoOrm, DepartamentoOrm, MunicipioOrm } from '@orm/shared/ubicacion';
import { TipoPreguntaCode, tipoPreguntaTypeFactory, TIPOS_PREGUNTA } from '@ctypes/evaluaciones';
import { PARENTEZCOS, parentezcoTypeFactory } from '@ctypes/encuestas';
import { tipoDocUsuarioTypeFactory } from '@ctypes/general/usuario';
import { STRING_UTILITIES } from '@common/application/services';
import { EpsOrm } from '@orm/shared';

export interface DTTAPLD {
  departamentos: DepartamentoOrm[];
  municipios: MunicipioOrm[];
  corregimientos: CorregimientoOrm[];
  opciones: OpcionOrm[];
  eps: EpsOrm[];
}

export const preguntaOrmToPreguntaResFactory = (data: PreguntaOrm) => {
  const np = new PreguntaRes();
  np.id = data.id;
  np.nombre = data.nombre;
  np.descripcion = data.descripcion;
  np.isOpcional = data.isOpcional;
  np.preguntaClaveId = data.preguntaClaveId;
  np.opcionClaveId = data.opcionClaveId;
  np.tipo = tipoPreguntaTypeFactory(data.tipoCode) as any;
  np.opciones = [];
  if (data.limSelMultiOrCarac) np.limSelMultiOrCarac = data.limSelMultiOrCarac;
  if (data.opciones) {
    data.opciones = orderBy(data.opciones, 'orden', 'asc');
    data.opciones.forEach(o => {
      if (o.isActiva) {
        const no = new OpcionRes();
        no.id = o.id;
        no.orden = o.orden;
        no.nombre = `${o.indicador ? `${o.indicador} ` : ''}${o.nombre}`;
        np.opciones.push(no);
      }
    });
  }

  return np;
};

export const formatoOrmToGenerateEncuestaResFactory = (data: FormatoOrm): GenerateEncuestaRes => {
  const e = new GenerateEncuestaRes();

  e.id = data.id;
  e.nombre = data.nombre;
  e.preguntas = [];

  data.preguntas = orderBy(data.preguntas, 'orden', 'asc');

  data.preguntas.forEach(p => {
    if (!p.preguntaId) {
      const np = preguntaOrmToPreguntaResFactory(p);
      np.complemento = [];
      if (p.tipoCode === TIPOS_PREGUNTA.COMPLEMENTADA.getCode()) {
        const complemento = cloneDeep(data.preguntas).filter(e => e.preguntaId === p.id);
        complemento.forEach(c => {
          np.complemento.push(preguntaOrmToPreguntaResFactory(c));
        });
        np.complemento = orderBy(np.complemento, 'orden', 'asc');
      }

      e.preguntas.push(np);
    }
  });

  return e;
};

export const encuestadoOrmToEncuestadoResFactory = (data: EncuestadoOrm) => {
  const e = new EncuestadoRes();
  e.id = data.id;
  e.fechaCreacion = data.fechaCreacion;
  e.creadoPor = new UsuarioBasicoRes();
  e.creadoPor.cedula = data.creadoPor.documento;
  data.creadoPor.setNombreCompleto();
  e.creadoPor.nombreCompleto = data.creadoPor.nombreCompleto;
  e.direccion = data.direccion;
  e.nombreCompleto = data.nombreCompleto;
  e.numeroDocumento = data.numeroDocumento;
  e.parentezco = parentezcoTypeFactory(data.parentezcoCode);
  e.tieneLibretaMilitar = data.tieneLibretaMilitar;
  e.tipoDocumento = tipoDocUsuarioTypeFactory(data.tipoDocumentoCode);
  e.cantViviendasPropias = data.encuestas.filter(
    ec => ec.formatoId === ENCUESTAS_KEY_IDS.caracterizacionVivienda
  ).length;
  e.cantFamiliares = data.familiares.filter(
    fm => fm.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()
  ).length;
  if (data.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()) {
    e.jefeHogar = new EncuestadoRes();
    e.jefeHogar.id = data.jefeHogar.id;
    e.jefeHogar.fechaCreacion = data.jefeHogar.fechaCreacion;
    e.jefeHogar.creadoPor = new UsuarioBasicoRes();
    e.jefeHogar.direccion = data.jefeHogar.direccion;
    e.jefeHogar.nombreCompleto = data.jefeHogar.nombreCompleto;
    e.jefeHogar.numeroDocumento = data.jefeHogar.numeroDocumento;
    e.jefeHogar.tieneLibretaMilitar = data.jefeHogar.tieneLibretaMilitar;
    e.jefeHogar.tipoDocumento = tipoDocUsuarioTypeFactory(data.jefeHogar.tipoDocumentoCode);
  }

  return e;
};

export const encuestadoOrmToEncuestadoForQueryFactory = (
  data: EncuestadoOrm,
  pl: DTTAPLD,
  isJefeHogar = true
) => {
  const e: any = {};

  e.id = data.id;
  e.isJefeHogar = isJefeHogar;
  e.fechaCreacion = data.fechaCreacion;
  e.nombreCompleto = data.nombreCompleto;
  e.numeroDocumento = data.numeroDocumento;
  e.parentezco = parentezcoTypeFactory(data.parentezcoCode);
  e.tipoDocumento = tipoDocUsuarioTypeFactory(data.tipoDocumentoCode);
  e.parentezcoForHumans = e.parentezco.forHumans;
  e.tieneLibretaMilitar = data.tieneLibretaMilitar;
  if (data.parentezcoCode === PARENTEZCOS.JEFE_HOGAR.getCode()) {
    e.cantViviendasPropias = data.encuestas.filter(
      ec => ec.formatoId === ENCUESTAS_KEY_IDS.caracterizacionVivienda
    ).length;
    e.cantFamiliares = data.familiares.filter(
      fm => fm.parentezcoCode !== PARENTEZCOS.JEFE_HOGAR.getCode()
    ).length;
  }
  e.direccion = data.direccion;
  if (isJefeHogar) e.familiares = [];

  data.encuestas.map(ec => {
    if (ec.formatoId === ENCUESTAS_KEY_IDS.caracterizacionHogar) {
      ec.respuestas.forEach((r, i) => {
        if (!i) e.caracterizacionHogar = {};
        e.caracterizacionHogar[
          `${r.pregunta.keyword || STRING_UTILITIES.formatForJson(r.pregunta.nombre)}`
        ] = refactorizeRespuestas(r.pregunta.tipoCode, r.respuesta, pl);
      });
    } else if (ec.formatoId === ENCUESTAS_KEY_IDS.caracterizacionVivienda) {
      ec.respuestas.forEach((r, i) => {
        if (!i) e.caracterizacionVivienda = {};
        e.caracterizacionVivienda[
          `${r.pregunta.keyword || STRING_UTILITIES.formatForJson(r.pregunta.nombre)}`
        ] = refactorizeRespuestas(r.pregunta.tipoCode, r.respuesta, pl);
      });
    } else if (ec.formatoId === ENCUESTAS_KEY_IDS.caracterizacionFamiliar) {
      ec.respuestas.forEach(r => {
        e[`${r.pregunta.keyword || STRING_UTILITIES.formatForJson(r.pregunta.nombre)}`] =
          refactorizeRespuestas(r.pregunta.tipoCode, r.respuesta, pl);
      });
      delete e['libretaMilitar'];
      delete e['parentezcoConElJefeDeHogar'];
    }
  });

  if (isJefeHogar) {
    data.familiares.map(ec => {
      e.familiares.push(encuestadoOrmToEncuestadoForQueryFactory(ec, pl, false));
    });
  }

  return e;
};

export const refactorizeRespuestas = (
  tipoPreguntaCode: TipoPreguntaCode,
  respuesta: string,
  pl: DTTAPLD
) => {
  const tipoPregunta = tipoPreguntaTypeFactory(tipoPreguntaCode);

  if ([TIPOS_PREGUNTA.SELECCION_MULTIPLE].indexOf(tipoPregunta) >= 0) {
    if (respuesta) {
      let data = respuesta.split(',');
      const arr: number[] = [];
      data.forEach(a => {
        arr.push(+a);
      });
      respuesta = arr as any;
    }
  }

  return respuesta
    ? [TIPOS_PREGUNTA.VALOR_MONETARIO, TIPOS_PREGUNTA.ABIERTA_NUMERICO].indexOf(tipoPregunta) >= 0
      ? +respuesta
      : [TIPOS_PREGUNTA.SI_NO].indexOf(tipoPregunta) >= 0
        ? +respuesta === 0
          ? false
          : true
        : [TIPOS_PREGUNTA.EPS].indexOf(tipoPregunta) >= 0
          ? pl.eps.filter(dp => dp.id === +respuesta)[0]
          : [TIPOS_PREGUNTA.DEPARTAMENTO].indexOf(tipoPregunta) >= 0
            ? pl.departamentos.filter(dp => dp.id === +respuesta)[0]
            : [TIPOS_PREGUNTA.MUNICIPIO].indexOf(tipoPregunta) >= 0
              ? pl.municipios.filter(dp => dp.id === +respuesta)[0]
              : [TIPOS_PREGUNTA.CORREGIMIENTO].indexOf(tipoPregunta) >= 0
                ? pl.corregimientos.filter(dp => dp.id === +respuesta)[0]
                : [TIPOS_PREGUNTA.PARENTEZCO].indexOf(tipoPregunta) >= 0
                  ? parentezcoTypeFactory(+respuesta as any)
                  : [TIPOS_PREGUNTA.TIPO_DOCUMENTO].indexOf(tipoPregunta) >= 0
                    ? tipoDocUsuarioTypeFactory(+respuesta as any)
                    : [TIPOS_PREGUNTA.SELECCION_UNICA].indexOf(tipoPregunta) >= 0
                      ? pl.opciones.filter(dp => dp.id === +respuesta)[0]
                      : [TIPOS_PREGUNTA.SELECCION_MULTIPLE].indexOf(tipoPregunta) >= 0
                        ? pl.opciones.filter(dp => respuesta.indexOf(dp.id as any) >= 0)
                        : respuesta
    : respuesta;
};
