import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get, Controller, BadRequestException, Param } from '@nestjs/common';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { GenerateEncuestaImpl } from '@enc/infrastructure/services';
import { GenerateEncuestaRes } from '@enc/application/responses';
import { ENC_AUTHORITIES } from '@authorities/encuestas';

@ApiTags('V1 | Encuestas')
@CommonGuards()
@Controller('v1/encuestas')
export class FormatoController {
  constructor(private _generateEncuesta: GenerateEncuestaImpl) {}

  @ApiOkResponse({ type: GenerateEncuestaRes })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Get('generar/:formatoId')
  async fetch(@Param('formatoId') formatoId: number) {
    try {
      return await this._generateEncuesta.execute(formatoId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
