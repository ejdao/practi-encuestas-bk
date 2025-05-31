import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DepartamentoCrudSource } from '@srd/ubicacion/infrastructure/repositories';
import { DepartamentoRes } from '@srd/ubicacion/application/responses';

@ApiTags('V1 | Ubicación')
@Controller('v1/srd/ubicacion/departamentos')
export class DepartamentosCrudController {
  constructor(private _crud: DepartamentoCrudSource) {}

  @ApiOkResponse({ type: DepartamentoRes, isArray: true })
  @ApiQuery({ name: 'paisId', required: true, type: Number })
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'addMunicipios', required: false, type: Boolean })
  @ApiQuery({ name: 'addCorregimientos', required: false, type: Boolean })
  @Get()
  public async fetch(
    @Query('paisId') paisId: number,
    @Query('pattern') pattern: string,
    @Query('addMunicipios') addMunicipios: boolean,
    @Query('addCorregimientos') addCorregimientos: boolean
  ): Promise<DepartamentoRes[]> {
    try {
      if (!paisId) throw new Error('Primero debe seleccionar un país');
      const result = await this._crud.fetch(+paisId, pattern, {
        addMunicipios,
        addCorregimientos,
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
