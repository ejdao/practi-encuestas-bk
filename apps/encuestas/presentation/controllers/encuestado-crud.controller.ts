import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, BadRequestException, Get, Query } from '@nestjs/common';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { EncuestadoCrudSource } from '@enc/infrastructure/repositories';
import { EncuestadoRes } from '@enc/application/responses';
import { ENC_AUTHORITIES } from '@authorities/encuestas';
import { STRING_UTILITIES } from '@common/application/services';
import { ParentezcoCode } from '@ctypes/encuestas';

@ApiTags('V1 | Encuestas')
@CommonGuards()
@Controller('v1/encuestas/encuestados')
export class EncuestadoCrudController {
  constructor(private _encuestadoCrud: EncuestadoCrudSource) {}

  @ApiOkResponse({ type: EncuestadoRes })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'parentezcoCode', required: false, type: Number })
  @ApiQuery({ name: 'onlyCreatedByMe', required: false, type: Boolean })
  @ApiQuery({ name: 'forComplement', required: false, type: Boolean })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Get()
  async fetch(
    @Query('pattern') pattern: string,
    @Query('parentezcoCode') parentezcoCode: ParentezcoCode,
    @Query('onlyCreatedByMe') onlyCreatedByMe: boolean,
    @Query('forComplement') forComplement: boolean
  ) {
    try {
      pattern = STRING_UTILITIES.upperCaseAndTrim(pattern);
      return await this._encuestadoCrud.fetch(
        pattern,
        parentezcoCode ? (+parentezcoCode as any) : undefined,
        onlyCreatedByMe ? onlyCreatedByMe : undefined,
        forComplement ? forComplement : undefined
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: EncuestadoRes })
  @Get('for-query')
  async fetchForQuery() {
    try {
      return await this._encuestadoCrud.fetchForQuery();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
