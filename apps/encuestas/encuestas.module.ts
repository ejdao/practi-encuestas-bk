import { Module } from '@nestjs/common';
import {
  GenerateEncuestaImpl,
  EvaluacionesBaseSource,
  CaracterizacionHogarImpl,
  CaracterizacionViviendaImpl,
  CaracterizacionFamiliarImpl,
} from './infrastructure/services';
import {
  EncuestaController,
  EncuestadoCrudController,
  FormatoController,
  RecursosController,
} from './presentation/controllers';
import { EncuestadoCrudSource } from './infrastructure/repositories';
import { AuthoritiesSource } from '@common/infrastructure/services';

@Module({
  controllers: [
    EncuestadoCrudController,
    FormatoController,
    EncuestaController,
    RecursosController,
  ],
  providers: [
    EncuestadoCrudSource,
    AuthoritiesSource,
    GenerateEncuestaImpl,
    EvaluacionesBaseSource,
    CaracterizacionHogarImpl,
    CaracterizacionViviendaImpl,
    CaracterizacionFamiliarImpl,
  ],
})
export class EncuestasModule {}
