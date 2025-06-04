import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get, Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { FetchModuloRes, OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';
import { ModulosCrudSource } from '@gen/seguridad/infrastructure/repositories';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { CreateModuloDto } from '@gen/seguridad/application/dtos';

@ApiTags('V1 | Modulos')
@CommonGuards()
@Controller('v1/gen/modulos')
export class ModulosController {
  constructor(private _crud: ModulosCrudSource) {}

  @ApiOkResponse({ type: FetchModuloRes })
  @Authorities()
  @Get()
  async fetch(): Promise<FetchModuloRes[]> {
    try {
      return await this._crud.fetch();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: OnlyIdFromEntityRes })
  @Authorities()
  @Post()
  async create(@Body() body: CreateModuloDto): Promise<OnlyIdFromEntityRes> {
    try {
      return await this._crud.create(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
