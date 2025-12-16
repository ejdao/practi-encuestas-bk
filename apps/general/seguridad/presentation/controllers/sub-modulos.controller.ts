import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SubModulosCrudSource } from '@gen/seguridad/infrastructure/repositories';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';
import { CreateSubModuloDto } from '@gen/seguridad/application/dtos';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Submodulos')
@CommonGuards()
@Controller('v1/gen/sub-modulos')
export class SubModulosController {
  constructor(private _crud: SubModulosCrudSource) {}

  @ApiOkResponse({ type: OnlyIdFromEntityRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.CREAR_PERMISOS])
  @Post()
  async create(@Body() body: CreateSubModuloDto): Promise<OnlyIdFromEntityRes> {
    try {
      return await this._crud.create(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
