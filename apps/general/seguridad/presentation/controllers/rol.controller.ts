import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { RolCrudSource } from '@gen/seguridad/infrastructure/repositories';
import { FetchRolRes } from '@gen/seguridad/application/responses';
import { GEN_AUTHORITIES } from '@authorities/general';

@ApiTags('V1 | Roles')
@CommonGuards()
@Controller('v1/gen/roles')
export class RolesController {
  constructor(private _crud: RolCrudSource) {}

  @ApiOkResponse({ type: FetchRolRes })
  @Authorities([
    GEN_AUTHORITIES.SEGURIDAD.REGISTRAR_ACTUALIZAR_USUARIOS,
    GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL,
  ])
  @ApiQuery({ name: 'pattern', required: false, type: String })
  @ApiQuery({ name: 'addComplements', required: false, type: Boolean })
  @Get()
  public async fetch(
    @Query('pattern') pattern: string,
    @Query('addComplements') addComplements: boolean
  ): Promise<FetchRolRes[]> {
    try {
      return await this._crud.fetch(pattern, addComplements);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
