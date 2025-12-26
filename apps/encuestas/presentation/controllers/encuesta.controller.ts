import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Controller, BadRequestException, Body, Post, Param } from '@nestjs/common';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { RespuestaPayload } from '@enc/application/payloads';
import { ENC_AUTHORITIES } from '@authorities/encuestas';
import {
  CaracterizacionFamiliarImpl,
  CaracterizacionHogarImpl,
  CaracterizacionViviendaImpl,
} from '@enc/infrastructure/services';

@ApiTags('V1 | Encuestas')
@CommonGuards()
@Controller('v1/encuestas')
export class EncuestaController {
  constructor(
    private _caracterizacionHogar: CaracterizacionHogarImpl,
    private _caracterizacionVivienda: CaracterizacionViviendaImpl,
    private _caracterizacionFamiliar: CaracterizacionFamiliarImpl
  ) {}

  @ApiCreatedResponse({ type: Boolean })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Post('caracterizacion-hogar/store-respuestas')
  async storeRespuestasCaracterizacionHogar(@Body() payload: RespuestaPayload[]) {
    try {
      return await this._caracterizacionHogar.storeRespuestas(payload);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiCreatedResponse({ type: Boolean })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Post('caracterizacion-vivienda/store-respuestas/:jefeHogarId')
  async storeRespuestasCaracterizacionVivienda(
    @Param('jefeHogarId') jefeHogarId: number,
    @Body() payload: RespuestaPayload[]
  ) {
    try {
      return await this._caracterizacionVivienda.storeRespuestas(jefeHogarId, payload);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiCreatedResponse({ type: Boolean })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Post('caracterizacion-familiar/store-respuestas/:jefeHogarId')
  async storeRespuestasCaracterizacionFamiliar(
    @Param('jefeHogarId') jefeHogarId: number,
    @Body() payload: RespuestaPayload[]
  ) {
    try {
      return await this._caracterizacionFamiliar.storeRespuestas(jefeHogarId, payload);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
