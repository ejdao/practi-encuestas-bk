import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { EpsRes, FetchEpsImpl } from '@shared/general/infrastructure/services';

@ApiTags('V1 | General')
@Controller('v1/srd/general/recursos')
export class RecursosController {
  constructor(private _fetchEps: FetchEpsImpl) {}

  @ApiOkResponse({ type: EpsRes, isArray: true })
  @ApiQuery({ name: 'pattern', required: true, type: String })
  @Get('eps')
  public async fetch(@Query('pattern') pattern: string): Promise<EpsRes[]> {
    try {
      const result = await this._fetchEps.execute(pattern);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
