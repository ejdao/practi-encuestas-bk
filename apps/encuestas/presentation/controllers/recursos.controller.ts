import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { ENC_AUTHORITIES } from '@authorities/encuestas';
import { CtmTypeRes } from '@common/application/responses';
import { TIPOS_DOCUMENTO_VALUES } from '@ctypes/general/usuario';
import { PARENTEZCOS_VALUES } from '@ctypes/encuestas';

@ApiTags('V1 | Encuestas')
@CommonGuards()
@Controller('v1/encuestas/recursos')
export class RecursosController {
  constructor() {}

  @ApiCreatedResponse({ type: CtmTypeRes, isArray: true })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Get('tipos-documento')
  async fetchTiposDocumentos() {
    return TIPOS_DOCUMENTO_VALUES;
  }

  @ApiCreatedResponse({ type: CtmTypeRes, isArray: true })
  @Authorities([ENC_AUTHORITIES.BASICO.REALIZAR, ENC_AUTHORITIES.BASICO.MODIFICAR])
  @Get('parentezcos')
  async fetchParentezcos() {
    return PARENTEZCOS_VALUES;
  }
}
